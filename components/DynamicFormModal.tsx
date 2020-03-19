import React from 'react'
import Modal from 'react-modal'

import { ModalProps } from './types'

// TODO - fix styles
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

Modal.setAppElement('body')

export default function DynamicFormModal(props: ModalProps) {
  const {
    failMessage,
    successMessage,
    status = {
      openModal: false,
      success: false
    },
    setStatus
  } = props

  function closeModal() {
    setStatus({
      openModal: false
    })
  }

  return (
    <div>
      <Modal
        isOpen={status.openModal}
        closeTimeoutMS={2}
        style={customStyles}
        contentLabel={failMessage || successMessage}
        shouldCloseOnOverlayClick={true}
      >
        <button onClick={closeModal}>close</button>
        {status!.success ? (
          <>
            <h3>{successMessage}</h3>
          </>
        ) : (
          <>
            <h3>{failMessage}</h3>
          </>
        )}
      </Modal>
    </div>
  )
}
