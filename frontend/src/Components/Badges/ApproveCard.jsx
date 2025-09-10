// src/components/RequestCard.jsx


const ApproveCard = ({ requestData, onApprove, onReject }) => {
  const { giverName, recipient, submittedDate, status, comments } = requestData;

  return (
    <div className="request-card-container">
      <div className="request-card">
        <div className="field-group">
          <span className="label">Giver Name:</span>
          <span className="value">{giverName}</span>
        </div>
        <div className="field-group">
          <span className="label">Recipient:</span>
          <span className="value">{recipient}</span>
        </div>
        <div className="field-group">
          <span className="label">Submitted Date:</span>
          <span className="value">{submittedDate}</span>
        </div>
        <div className="field-group">
          <span className="label">Status:</span>
          <span className="value status-pending">{status}</span>
        </div>
        <div className="field-group">
          <span className="label">Comments:</span>
          <span className="value comments">{comments}</span>
        </div>
        <div className="button-group">
          <button className="approve-button" onClick={onApprove}>
            Approve
          </button>
          <button className="reject-button" onClick={onReject}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveCard;