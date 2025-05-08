import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Breadcrumbs,
  Link,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SecurityIcon from '@mui/icons-material/Security';

const PrivacyPolicyPage = () => {
  // Get the current date for displaying "last updated"
  const currentDate = new Date();
  const lastUpdated = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Home
        </Link>
        <Typography color="text.primary">Privacy Policy</Typography>
      </Breadcrumbs>

      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SecurityIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4" component="h1">
            Privacy Policy
          </Typography>
        </Box>
        
        <Typography variant="subtitle2" color="text.secondary" paragraph>
          Last Updated: {lastUpdated}
        </Typography>
        
        <Typography variant="body1" paragraph>
          At Open Media Search, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the service.
        </Typography>

        <Typography variant="body1" paragraph>
          We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">1. Information We Collect</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              We collect information that you provide directly to us, information we collect automatically when you use our service, and information from third-party sources. The types of data we may collect include:
            </Typography>

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Personal Data</Typography>
            <TableContainer sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Type of Data</strong></TableCell>
                    <TableCell><strong>Purpose</strong></TableCell>
                    <TableCell><strong>Legal Basis</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>To identify you and personalize your experience</TableCell>
                    <TableCell>Consent, Legitimate Interest</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email Address</TableCell>
                    <TableCell>To create and maintain your account, communicate with you</TableCell>
                    <TableCell>Consent, Legitimate Interest, Contract</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Password (encrypted)</TableCell>
                    <TableCell>To secure your account</TableCell>
                    <TableCell>Consent, Contract</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Usage Data</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Type of Data</strong></TableCell>
                    <TableCell><strong>Purpose</strong></TableCell>
                    <TableCell><strong>Legal Basis</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Search History</TableCell>
                    <TableCell>To provide search history functionality, improve our service</TableCell>
                    <TableCell>Consent, Legitimate Interest</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>IP Address</TableCell>
                    <TableCell>To maintain security, prevent fraud</TableCell>
                    <TableCell>Legitimate Interest</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Browser Type</TableCell>
                    <TableCell>To optimize our service for different devices</TableCell>
                    <TableCell>Legitimate Interest</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Access Times</TableCell>
                    <TableCell>To maintain security, analyze usage patterns</TableCell>
                    <TableCell>Legitimate Interest</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">2. How We Use Your Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              We use the information we collect for various purposes, including:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">To provide and maintain our service</Typography>
              </li>
              <li>
                <Typography variant="body1">To notify you about changes to our service</Typography>
              </li>
              <li>
                <Typography variant="body1">To allow you to participate in interactive features of our service</Typography>
              </li>
              <li>
                <Typography variant="body1">To provide customer support</Typography>
              </li>
              <li>
                <Typography variant="body1">To gather analysis or valuable information so that we can improve our service</Typography>
              </li>
              <li>
                <Typography variant="body1">To monitor the usage of our service</Typography>
              </li>
              <li>
                <Typography variant="body1">To detect, prevent and address technical issues</Typography>
              </li>
            </ul>
            <Typography variant="body1" paragraph>
              We will only use your personal data for the purposes for which we collected it, unless we reasonably consider that we need to use it for another reason and that reason is compatible with the original purpose.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">3. Disclosure of Your Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>Third-Party Service Providers</Typography>
            <Typography variant="body1" paragraph>
              We may share your information with third-party service providers to:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">Facilitate our service</Typography>
              </li>
              <li>
                <Typography variant="body1">Provide the service on our behalf</Typography>
              </li>
              <li>
                <Typography variant="body1">Perform service-related services</Typography>
              </li>
              <li>
                <Typography variant="body1">Assist us in analyzing how our service is used</Typography>
              </li>
            </ul>
            <Typography variant="body1" paragraph>
              These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>Legal Requirements</Typography>
            <Typography variant="body1" paragraph>
              We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process, such as in response to a court order or a subpoena.
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>Business Transfers</Typography>
            <Typography variant="body1" paragraph>
              We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">4. Storage and Security of Data</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1" gutterBottom>Data Storage</Typography>
            <Typography variant="body1" paragraph>
              Your data is stored and processed primarily in the United Kingdom. However, your information may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
            </Typography>
            <Typography variant="body1" paragraph>
              If you are located outside the United Kingdom and choose to provide information to us, please note that we transfer the data, including personal data, to the United Kingdom and process it there. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>Data Security</Typography>
            <Typography variant="body1" paragraph>
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
            </Typography>
            <Typography variant="body1" paragraph>
              We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information, including:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">All sensitive information is transmitted via Secure Socket Layer (SSL) technology</Typography>
              </li>
              <li>
                <Typography variant="body1">All personal information is kept in a secured database behind firewalls</Typography>
              </li>
              <li>
                <Typography variant="body1">Passwords are stored in an encrypted format</Typography>
              </li>
              <li>
                <Typography variant="body1">Regular security assessments and penetration testing</Typography>
              </li>
            </ul>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">5. Data Retention</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              We will retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your personal data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
            </Typography>
            <Typography variant="body1" paragraph>
              Different types of data may be retained for different periods:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">Account information: Retained while your account is active. If you close your account, we'll delete this information within 30 days, except where retention is necessary for legal purposes.</Typography>
              </li>
              <li>
                <Typography variant="body1">Search history: Retained for 12 months to provide the search history functionality.</Typography>
              </li>
              <li>
                <Typography variant="body1">Usage data: Retained for up to 24 months to help us improve our service.</Typography>
              </li>
            </ul>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">6. Your Data Protection Rights</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Depending on your location, you may have certain rights regarding your personal data under applicable data protection laws. These may include:
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>For users in the European Economic Area (EEA) and UK:</Typography>
            <ul>
              <li>
                <Typography variant="body1"><strong>Right to Access:</strong> You have the right to request copies of your personal data.</Typography>
              </li>
              <li>
                <Typography variant="body1"><strong>Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</Typography>
              </li>
              <li>
                <Typography variant="body1"><strong>Right to Erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</Typography>
              </li>
              <li>
                <Typography variant="body1"><strong>Right to Restrict Processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</Typography>
              </li>
              <li>
                <Typography variant="body1"><strong>Right to Object to Processing:</strong> You have the right to object to our processing of your personal data, under certain conditions.</Typography>
              </li>
              <li>
                <Typography variant="body1"><strong>Right to Data Portability:</strong> You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.</Typography>
              </li>
            </ul>
            
            <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>For users in California:</Typography>
            <Typography variant="body1" paragraph>
              Under the California Consumer Privacy Act (CCPA), California residents have specific rights regarding their personal information:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1"><strong>Right to Know:</strong> You can request information about the personal information we've collected about you and how we've used and disclosed it.</Typography>
              </li>
              <li>
                <Typography variant="body1"><strong>Right to Delete:</strong> You can request that we delete the personal information we've collected from you, with some exceptions.</Typography>
              </li>
              <li>
                <Typography variant="body1"><strong>Right to Opt-Out:</strong> You can opt-out of the sale of your personal information.</Typography>
              </li>
              <li>
                <Typography variant="body1"><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of your CCPA rights.</Typography>
              </li>
            </ul>
            
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at our email: support@openmediasearch.com.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">7. Cookies and Tracking Technologies</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              We use cookies and similar tracking technologies to track the activity on our service and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device.
            </Typography>
            <Typography variant="body1" paragraph>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            </Typography>
            <Typography variant="body1" paragraph>
              We use the following types of cookies:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1"><strong>Essential Cookies:</strong> Required for the operation of our service. They include, for example, cookies that enable you to log into secure areas.</Typography>
              </li>
              <li>
                <Typography variant="body1"><strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count the number of visitors and see how visitors move around our service. This helps us improve how our service works.</Typography>
              </li>
              <li>
                <Typography variant="body1"><strong>Functionality Cookies:</strong> Used to recognize you when you return to our service. This enables us to personalize our content for you and remember your preferences.</Typography>
              </li>
            </ul>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">8. Children's Privacy</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Our service is not directed to anyone under the age of 16 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 16. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
            </Typography>
            <Typography variant="body1" paragraph>
              If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">9. Changes to This Privacy Policy</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
            </Typography>
            <Typography variant="body1" paragraph>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">10. Contact Us</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              If you have any questions about this Privacy Policy, please contact us:
            </Typography>
            <Typography variant="body1">
              By email: privacy@openmediasearch.com
            </Typography>
            <Typography variant="body1">
              By phone: +44 1522 882000
            </Typography>
            <Typography variant="body1" paragraph>
              By mail: Data Protection Officer, Open Media Search, University of Lincoln, Brayford Pool, Lincoln, LN6 7TS, United Kingdom
            </Typography>
            <Typography variant="body1" paragraph>
              If you have an unresolved privacy or data use concern that we have not addressed satisfactorily, please contact our UK-based third-party dispute resolution provider (free of charge) at https://ico.org.uk.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            By using Open Media Search, you consent to our Privacy Policy and agree to its terms.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default PrivacyPolicyPage;