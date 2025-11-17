import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthState } from '@/hooks/useAuthState';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebase } from '@/config/firebase';
import * as ImagePicker from 'expo-image-picker';

interface AdditionalTask {
  id: string;
  description: string;
  details: string;
}

export default function JobCompletionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuthState();
  const jobId = params.jobId as string;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [whatWasDone, setWhatWasDone] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [additionalTasks, setAdditionalTasks] = useState<AdditionalTask[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDetails, setNewTaskDetails] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [notes, setNotes] = useState('');

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => asset.uri);
        setImages([...images, ...newImages]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera permissions to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const addAdditionalTask = () => {
    if (!newTaskDescription.trim()) {
      Alert.alert('Error', 'Please enter a task description');
      return;
    }

    const task: AdditionalTask = {
      id: Date.now().toString(),
      description: newTaskDescription,
      details: newTaskDetails,
    };

    setAdditionalTasks([...additionalTasks, task]);
    setNewTaskDescription('');
    setNewTaskDetails('');
  };

  const removeAdditionalTask = (id: string) => {
    setAdditionalTasks(additionalTasks.filter((task) => task.id !== id));
  };

  const uploadImage = async (uri: string, jobId: string, index: number): Promise<string> => {
    const { storage } = getFirebase();
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `completion-${Date.now()}-${index}.jpg`;
    const storageRef = ref(storage, `job-completions/${jobId}/${filename}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const submitCompletionForm = async () => {
    if (!whatWasDone.trim()) {
      Alert.alert('Error', 'Please describe what was done');
      return;
    }

    if (!user || !jobId) {
      Alert.alert('Error', 'Missing user or job information');
      return;
    }

    setSubmitting(true);

    try {
      const { db, storage } = getFirebase();

      // Get job details
      const jobDoc = await getDoc(doc(db, 'jobs', jobId));
      if (!jobDoc.exists()) {
        Alert.alert('Error', 'Job not found');
        setSubmitting(false);
        return;
      }

      const jobData = jobDoc.data();

      // Upload images
      const uploadedImageUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const url = await uploadImage(images[i], jobId, i);
        uploadedImageUrls.push(url);
      }

      // Create completion form document
      const completionFormId = `completion-${jobId}-${Date.now()}`;
      const completionFormData = {
        id: completionFormId,
        jobId: jobId,
        artisanId: user.uid,
        artisanName: jobData.artisanName || 'Unknown Artisan',
        clientId: jobData.clientId,
        clientName: jobData.clientName || 'Unknown Client',
        status: 'pending', // pending, approved, rejected
        whatWasDone: whatWasDone.trim(),
        images: uploadedImageUrls,
        additionalTasks: additionalTasks,
        materialsUsed: materialsUsed.trim() || null,
        hoursWorked: hoursWorked.trim() || null,
        notes: notes.trim() || null,
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      // Save completion form
      await setDoc(doc(db, 'jobCompletions', completionFormId), completionFormData);

      // Update job status to 'pending-completion'
      await setDoc(
        doc(db, 'jobs', jobId),
        {
          status: 'pending-completion',
          completionFormId: completionFormId,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Create notification for artisan
      await setDoc(doc(db, 'notifications', `notif-${Date.now()}-${user.uid}`), {
        userId: user.uid,
        type: 'completion-submitted',
        title: 'Completion Form Submitted',
        message: 'Your job completion form has been submitted and is pending admin approval.',
        jobId: jobId,
        completionFormId: completionFormId,
        read: false,
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        'Success',
        'Completion form submitted successfully! You will be notified when admin approves it.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting completion form:', error);
      Alert.alert('Error', 'Failed to submit completion form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Job Completion Form</Text>
        <Text style={styles.subtitle}>Fill out all required information</Text>
      </View>

      <View style={styles.content}>
        {/* What Was Done - Required */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            What Was Done <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe the work that was completed..."
            value={whatWasDone}
            onChangeText={setWhatWasDone}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Text style={styles.sectionSubtitle}>Add photos of the completed work</Text>
          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>📷 Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
              <Text style={styles.imageButtonText}>📸 Take Photo</Text>
            </TouchableOpacity>
          </View>

          {images.length > 0 && (
            <View style={styles.imageGrid}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeImageText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Additional Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Tasks</Text>
          <Text style={styles.sectionSubtitle}>Add any additional work that was done</Text>

          {additionalTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskDescription}>{task.description}</Text>
                <TouchableOpacity onPress={() => removeAdditionalTask(task.id)}>
                  <Text style={styles.removeTaskText}>Remove</Text>
                </TouchableOpacity>
              </View>
              {task.details && (
                <Text style={styles.taskDetails}>{task.details}</Text>
              )}
            </View>
          ))}

          <View style={styles.addTaskContainer}>
            <TextInput
              style={styles.taskInput}
              placeholder="Task description"
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
            />
            <TextInput
              style={[styles.taskInput, styles.taskDetailsInput]}
              placeholder="Task details (optional)"
              value={newTaskDetails}
              onChangeText={setNewTaskDetails}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.addTaskButton} onPress={addAdditionalTask}>
              <Text style={styles.addTaskButtonText}>+ Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Materials Used */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Materials Used</Text>
          <Text style={styles.sectionSubtitle}>List any materials or parts used</Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g., 2x4 lumber, screws, paint..."
            value={materialsUsed}
            onChangeText={setMaterialsUsed}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Hours Worked */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hours Worked</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 4.5 hours"
            value={hoursWorked}
            onChangeText={setHoursWorked}
            keyboardType="numeric"
          />
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <Text style={styles.sectionSubtitle}>Any other relevant information</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Add any additional notes or comments..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={submitCompletionForm}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Completion Form</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          This form will be sent to admin for approval. You will be notified once it's reviewed.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
    minHeight: 100,
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    width: '47%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  removeTaskText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  taskDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  addTaskContainer: {
    marginTop: 12,
  },
  taskInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  taskDetailsInput: {
    minHeight: 60,
  },
  addTaskButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addTaskButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
});

