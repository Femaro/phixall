'use server';

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';
import { getFirebaseServer } from './firebaseServer';
import type { SupportArticle } from './supportKnowledge';
import { supportArticles as fallbackArticles } from './supportKnowledge';

type FirestoreArticle = SupportArticle & {
  roles?: string[];
  priority?: number;
  updatedAt?: { toDate: () => Date };
};

export async function loadSupportArticles(role: 'client' | 'Phixer' | 'admin'): Promise<SupportArticle[]> {
  try {
    const { db } = getFirebaseServer();
    const articlesRef = collection(db, 'support_articles');
    const snapshot = await getDocs(query(articlesRef, orderBy('updatedAt', 'desc'), limit(50)));
    if (snapshot.empty) {
      return fallbackArticles;
    }

    const mapped = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as FirestoreArticle;
      return {
        id: docSnap.id,
        role: data.role || 'general',
        title: data.title,
        content: data.content,
        tags: data.tags || [],
        roles: data.roles,
        priority: data.priority,
      } as SupportArticle & { roles?: string[]; priority?: number };
    });

    return mapped.filter((article) => {
      if (article.roles?.length) {
        return article.roles.includes(role) || article.roles.includes('general');
      }
      return article.role === role || article.role === 'general';
    });
  } catch (error) {
    console.warn('Failed to load dynamic support articles, falling back to defaults', error);
    return fallbackArticles;
  }
}


