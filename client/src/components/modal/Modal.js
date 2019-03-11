import React from 'react';

import './modal.css';

const modal = props => (
  <div className="modal">
    <header>{props.title}</header>
    <section className="modal-content">
      {props.children}
    </section>
    <section className="modal-actions">
      {props.canCancel && <button className="btn" onClick={props.onCancel}>Cancel</button>}
      {props.canConfirm && <button className="btn" onClick={props.onConfirm}>Confirm</button>}
    </section>
  </div>
);

export default modal;
