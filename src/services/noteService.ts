import axios from 'axios';
import type { Note } from '../types/note';

interface NoteHubResponse {
  notes: Note[];
  totalPage: number;
}
interface CreateNote {
  title: string;
  content: string;
  tag: string;
}
const noteAPI = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});
export const fetchNotes = async (
  searchText: string,
  page: number = 1,
  perPage: number = 12
): Promise<NoteHubResponse> => {
  const response = await noteAPI.get('/notes', {
    params: {
      search: searchText,
      page: page,
      perPage: perPage,
    },
  });
  return response.data;
};
export const createNote = (note: CreateNote) => {
  const response = noteAPI.post<Note>('/notes', note);
  return response.data;
};
export const deleteNote = (noteID: string) => {
  const response = noteAPI.delete<Note>(`/notes/${noteID}`);
  return response.data;
};
