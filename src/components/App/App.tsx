import css from './App.module.css';
import { fetchNotes } from '../../services/noteService';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import NoteForm from '../NoteForm/NoteForm';
function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [IsFormOpen, setIsFormOpen] = useState(false);
  const updateSearchQuery = useDebouncedCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, 1000);
  const { data, isSuccess } = useQuery({
    queryKey: ['notes', searchQuery, currentPage],
    queryFn: () => fetchNotes(searchQuery, currentPage),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox onSearch={updateSearchQuery} />}
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={currentPage}
            setPage={setCurrentPage}
          />
        )}
        {
          <button className={css.button} onClick={() => setIsFormOpen(true)}>
            Create note +
          </button>
        }
      </header>
      {isSuccess && notes.length > 0 && <NoteList notes={notes} />}
      {IsFormOpen && (
        <Modal
          onClose={() => setIsFormOpen(false)}
          children={<NoteForm onClose={() => setIsFormOpen(false)} />}
        />
      )}
    </div>
  );
}

export default App;
