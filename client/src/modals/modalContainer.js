import React from 'react';
import { connect } from 'react-redux';

/** Modal Type Constants */
import { ALERT_MODAL, CONFIRM_MODAL } from './modalTypes'; 

/** Modal Components */
import AlertModal from './alertModal';
import ConfirmModal from './confirmModal';

const MODAL_COMPONENTS = {
  ALERT_MODAL: AlertModal,
  CONFIRM_MODAL: ConfirmModal
};

const ModalContainer = (props) => {
  if (!props.modalType) 
    return null;

  const ModalToDisplay = MODAL_COMPONENTS[props.modalType];

  return <ModalToDisplay />;
};

const mapStateToProps = state => ({
  modalType: state.modal.modalType
});

export default connect(mapStateToProps)(ModalContainer);