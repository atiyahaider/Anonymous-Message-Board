import { SHOW_MODAL, HIDE_MODAL, MODAL_LOADING, MODAL_ERROR, CLEAR_MODAL_ERROR } from './actionTypes';

export const showModal = (modalType, modalProps) => {
  return {
    type: SHOW_MODAL,
    modalType,
    modalProps
  };
};

export const hideModal = () => {
  return {
    type: HIDE_MODAL
  };
};

export const setModalLoading = () => {
  return {
    type: MODAL_LOADING
  }
};

export const setModalError = (err) => {
  return {
    type: MODAL_ERROR,
    err
  };
};

export const clearModalError = () => {
  return {
    type: CLEAR_MODAL_ERROR
  };
};
