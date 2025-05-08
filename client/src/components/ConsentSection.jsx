import React from 'react';
import { 
  Box, 
  Typography, 
  FormControlLabel, 
  Checkbox, 
  Link, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Component to display consent information during registration
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.dataConsent - Current state of data consent checkbox
 * @param {boolean} props.termsConsent - Current state of terms checkbox
 * @param {Function} props.onConsentChange - Function called when consent checkboxes change
 * @param {boolean} props.showErrors - Whether to display validation errors
 * @returns {JSX.Element} The consent section UI
 */
const ConsentSection = ({ 
  dataConsent, 
  termsConsent, 
  onConsentChange,
  showErrors
}) => {
  
  return (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Consent and Terms
      </Typography>
      
      {showErrors && (!dataConsent || !termsConsent) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          You must accept the terms and privacy policy to register
        </Alert>
      )}
      
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="data-processing-content"
          id="data-processing-header"
        >
          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1, fontSize: 20 }} />
            Data Processing Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            We collect and process your data to provide our open media search service. This includes:
          </Typography>
          <ul>
            <li>
              <Typography variant="body2">
                Account information: Your name and email address for authentication and service provision.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Search history: Your search queries to enable history functionality and service improvement.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Usage data: Information about how you interact with our service to improve user experience.
              </Typography>
            </li>
          </ul>
          <Typography variant="body2" paragraph>
            We process this data based on your consent and our legitimate interest in providing and improving our services. You can withdraw your consent at any time by deleting your account from your profile page.
          </Typography>
          <Typography variant="body2">
            For more information, please read our complete <Link href="#" target="_blank">Privacy Policy</Link>.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <FormControlLabel
        control={
          <Checkbox 
            name="dataConsent"
            checked={dataConsent}
            onChange={(e) => onConsentChange('dataConsent', e.target.checked)}
            color="primary"
          />
        }
        label={
          <Typography variant="body2">
            I consent to the collection and processing of my personal data as described in the Privacy Policy
          </Typography>
        }
        sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          ml: 0,
          ...(showErrors && !dataConsent ? { color: 'error.main' } : {})
        }}
      />
      
      <FormControlLabel
        control={
          <Checkbox 
            name="termsConsent"
            checked={termsConsent}
            onChange={(e) => onConsentChange('termsConsent', e.target.checked)}
            color="primary"
          />
        }
        label={
          <Typography variant="body2">
            I agree to the <Link href="terms" target="_blank">Terms and Conditions</Link> and <Link href="privacy" target="_blank">Privacy Policy</Link>
          </Typography>
        }
        sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          ml: 0,
          mt: 1,
          ...(showErrors && !termsConsent ? { color: 'error.main' } : {})
        }}
      />
      
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        By clicking "Register", you confirm that you have read and understood our data processing practices and agree to our terms of service.
      </Typography>
    </Box>
  );
};

export default ConsentSection;