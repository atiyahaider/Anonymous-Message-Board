import { SHOW_MODAL, HIDE_MODAL, MODAL_LOADING, MODAL_ERROR, CLEAR_MODAL_ERROR } from '../actions/actionTypes';

const initialState = {
  modalType: null,
  modalProps: {},
  loading: false,
  err: null
};

export default function(state = initialState, action) {
  
  switch(action.type) {
    
    case SHOW_MODAL:
      return {
        ...state,
        modalType: action.modalType,
        modalProps: action.modalProps,
        loading: false,
        err: null
      }      
    
    case HIDE_MODAL:
      return initialState;
   
      
    case MODAL_LOADING:
      return {
        ...state,
        loading: true,
        err: null
      }
      
    case MODAL_ERROR:
      return {
        ...state,
        loading: false,
        err: action.err
      }      

    case CLEAR_MODAL_ERROR:
      return {
        ...state,
        loading: false,
        err: null
      }      

    default:
      return state;
  }
}



