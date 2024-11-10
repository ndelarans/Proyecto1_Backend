// book.controller.ts
import {
    createBookAction,
    updateBookAction,
    deleteBookAction,
    getBookAction,
    getBooksAction,
    reserveBookAction
  } from '../actions/book.action';
  
  // Controlador para crear un libro
  export const createBookController = async (bookData: object) => {
    const newBook = await createBookAction(bookData);
    return newBook;
  };
  
  // Controlador para actualizar un libro
  export const updateBookController = async (bookId: string, updates: object) => {
    const updatedBook = await updateBookAction(bookId, updates);
    return updatedBook;
  };
  
  // Controlador para eliminar un libro
  export const deleteBookController = async (bookId: string) => {
    const deletedBook = await deleteBookAction(bookId);
    return deletedBook;
  };
  
  // Controlador para obtener un libro por ID
  export const getBookController = async (bookId: string) => {
    const book = await getBookAction(bookId);
    return book;
  };
  
  // Controlador para obtener una lista de libros según filtros
  export const getBooksController = async (filters: any) => {
    const books = await getBooksAction(filters);
    return books;
  };
  
  // Controlador para reservar un libro
  export const reserveBookController = async (bookId: string, userId: string) => {
    const reservedBook = await reserveBookAction(bookId, userId);
    return reservedBook;
  };
  