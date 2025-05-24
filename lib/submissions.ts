import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebase'
import { Submission } from '@/types'

interface SubmissionData {
  name: string
  email: string
  phone: string
  location: string
  message: string
  equipment?: Array<{
    category: 'hooks' | 'lures' | 'lines' | 'nets' | 'weights' | 'floats' | 'other'
    quantity: 'few' | 'many' | 'lots' | 'huge_haul' | '1-5m' | '5-10m' | '10-20m' | '20m+' | '1' | '2' | '3' | '4' | 'more'
    description?: string
    adminAdjustedCount?: number
  }>
}

export async function submitReport(
  data: SubmissionData, 
  images: File[], 
  coordinates?: {lat: number, lng: number}
): Promise<void> {
  try {
    // Upload images first
    const imageUrls: string[] = []
    
    for (const image of images) {
      const imageRef = ref(storage, `submissions/${Date.now()}_${image.name}`)
      const snapshot = await uploadBytes(imageRef, image)
      const downloadURL = await getDownloadURL(snapshot.ref)
      imageUrls.push(downloadURL)
    }
    
    // Create submission document
    const submissionData = {
      ...data,
      coordinates,
      images: imageUrls,
      status: 'pending',
      createdAt: new Date(),
    }
    
    await addDoc(collection(db, 'submissions'), submissionData)
  } catch (error) {
    console.error('Error submitting report:', error)
    throw error
  }
}

export async function getSubmissions(status?: 'pending' | 'approved' | 'rejected'): Promise<Submission[]> {
  try {
    let q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'))
    
    if (status) {
      q = query(collection(db, 'submissions'), where('status', '==', status), orderBy('createdAt', 'desc'))
    }
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      approvedAt: doc.data().approvedAt?.toDate(),
    })) as Submission[]
  } catch (error) {
    console.error('Error getting submissions:', error)
    throw error
  }
}

export async function updateSubmissionStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
  try {
    const submissionRef = doc(db, 'submissions', id)
    const updateData: any = { status }
    
    if (status === 'approved') {
      updateData.approvedAt = new Date()
    }
    
    await updateDoc(submissionRef, updateData)
  } catch (error) {
    console.error('Error updating submission status:', error)
    throw error
  }
}

export async function deleteSubmission(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'submissions', id))
  } catch (error) {
    console.error('Error deleting submission:', error)
    throw error
  }
} 