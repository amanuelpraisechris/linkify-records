
interface NoMatchesMessageProps {
  onManualReview: () => void;
  isLoading: boolean;
}

const NoMatchesMessage = ({ onManualReview, isLoading }: NoMatchesMessageProps) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium mb-2">No Matches to Process</h3>
      <p className="text-muted-foreground">There are no more potential matches to review.</p>
      {onManualReview && (
        <button
          onClick={onManualReview}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all-medium"
          disabled={isLoading}
        >
          Send for Manual Review
        </button>
      )}
    </div>
  );
};

export default NoMatchesMessage;
