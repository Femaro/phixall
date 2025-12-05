import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getFirebase } from '@/config/firebase';
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';

interface RatingFormProps {
  visible: boolean;
  onClose: () => void;
  jobId: string;
  userId: string;
  userRole: 'client' | 'Phixer' | 'artisan';
  targetRole: 'client' | 'Phixer' | 'artisan';
  targetName?: string;
}

export function RatingForm({
  visible,
  onClose,
  jobId,
  userId,
  userRole,
  targetRole,
  targetName,
}: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      const { db } = getFirebase();
      const jobRef = doc(db, 'jobs', jobId);
      const jobDoc = await getDoc(jobRef);

      if (!jobDoc.exists()) {
        Alert.alert('Error', 'Job not found');
        return;
      }

      const jobData = jobDoc.data();
      const reviewField = userRole === 'client' ? 'clientReview' : 'artisanReview';
      const nameField = userRole === 'client' ? 'clientName' : targetRole === 'Phixer' ? 'phixerName' : 'artisanName';

      await updateDoc(jobRef, {
        [reviewField]: {
          rating,
          feedback: feedback.trim() || null,
          [userRole === 'client' ? 'clientName' : 'artisanName']: jobData[nameField] || 'Unknown',
        },
        updatedAt: serverTimestamp(),
      });

      // Update average rating for the target user
      const targetUserId = userRole === 'client' ? jobData.phixerId || jobData.artisanId : jobData.clientId;
      if (targetUserId) {
        await updateUserAverageRating(db, targetUserId, targetRole === 'client' ? 'client' : 'artisan');
      }

      Alert.alert('Success', 'Rating submitted successfully!', [
        { text: 'OK', onPress: onClose },
      ]);
      
      // Reset form
      setRating(0);
      setFeedback('');
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', 'Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateUserAverageRating = async (db: any, userId: string, role: 'client' | 'artisan') => {
    try {
      // Get all jobs where this user was rated
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const jobsQuery = query(
        collection(db, 'jobs'),
        where(role === 'client' ? 'clientId' : 'phixerId', '==', userId)
      );
      
      const snapshot = await getDocs(jobsQuery);
      const reviews: number[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const review = role === 'client' ? data.clientReview : data.artisanReview;
        if (review && review.rating) {
          reviews.push(review.rating);
        }
      });

      if (reviews.length > 0) {
        const average = reviews.reduce((sum, r) => sum + r, 0) / reviews.length;
        const profileRef = doc(db, 'profiles', userId);
        await updateDoc(profileRef, {
          [`${role}AverageRating`]: average,
        });
      }
    } catch (error) {
      console.error('Error updating average rating:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Rate {targetRole === 'client' ? 'Client' : 'Phixer'}
            </Text>
            {targetName && (
              <Text style={styles.subtitle}>{targetName}</Text>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Rating *</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Text style={[styles.star, star <= rating && styles.starActive]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <Text style={styles.ratingText}>{rating} out of 5</Text>
            )}

            <Text style={[styles.label, styles.feedbackLabel]}>Feedback (Optional)</Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Share your experience..."
              placeholderTextColor="#9CA3AF"
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={4}
              maxLength={500}
            />

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting || rating === 0}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Rating</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    position: 'relative',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  feedbackLabel: {
    marginTop: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 32,
    opacity: 0.3,
  },
  starActive: {
    opacity: 1,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

