import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const QuoteFormHook = (profile) => {
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedPrice, setSuggestedPrice] = useState('');
    const [totalAmountDue, setTotalAmountDue] = useState('');

    const handleGetQuote = async (gallonsRequested) => {
        setIsLoading(true);
        if (!profile) {
            toast.error('You must update your profile to submit a quote.');
            setTimeout(() => navigate('/profile/'), 1600);
            return;
        }
        const quoteData = {
            location: profile.state,
            gallons_requested: gallonsRequested,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/get-quote/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quoteData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setSuggestedPrice(data.suggested_price);
            setTotalAmountDue(data.total_amount_due);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("An error occurred while fetching the quote.");
        } finally {
            setIsLoading(false); // Stop loading indicator
        }
    };

    const handleSubmitQuote = async (quoteData) => {
        if (!profile) {
            toast.error('You must update your profile to submit a quote.');
            setTimeout(() => navigate('/profile/'), 1600);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/submit-quote/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,
                },
                body: JSON.stringify(quoteData),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(data.message || 'Quote submitted successfully.');
                setTimeout(() => navigate('/quotehistory'), 1600);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit quote.');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while submitting the quote.');
        }
    };

    return { handleGetQuote, handleSubmitQuote, isLoading, suggestedPrice, totalAmountDue };
};

export default QuoteFormHook;
