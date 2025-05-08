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
  AccordionDetails
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const TermsAndConditionsPage = () => {
  // Get the current date for displaying "last updated"
  const currentDate = new Date();
  const lastUpdated = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Home
        </Link>
        <Typography color="text.primary">Terms and Conditions</Typography>
      </Breadcrumbs>

      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Terms and Conditions
        </Typography>
        
        <Typography variant="subtitle2" color="text.secondary" paragraph>
          Last Updated: {lastUpdated}
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to Open Media Search. Please read these Terms and Conditions carefully before using our service.
          By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms,
          you may not access the service.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">1. Terms of Use</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Open Media Search provides a platform for searching and accessing open-licensed media content. The service is provided "as is" and "as available" without warranties of any kind, either express or implied.
            </Typography>
            <Typography variant="body1" paragraph>
              We do not claim ownership of any media content accessible through our service. All media content is provided by third-party sources and is subject to the licenses and terms specified by the original creators or distributors.
            </Typography>
            <Typography variant="body1" paragraph>
              You may use our service only as permitted by law and according to these Terms. You agree not to misuse the service or help anyone else do so.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">2. User Accounts</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password you use to access the service and for any activities or actions under your password.
            </Typography>
            <Typography variant="body1" paragraph>
              You agree not to share your account credentials with any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </Typography>
            <Typography variant="body1" paragraph>
              We reserve the right to terminate or suspend your account at any time for any reason, including, but not limited to, violation of these Terms.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">3. Intellectual Property and Media Licensing</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Our service allows you to search for and access media content under various open licenses, such as Creative Commons licenses, public domain, and other open licenses.
            </Typography>
            <Typography variant="body1" paragraph>
              The media content accessible through our service is subject to the specific license terms applied by the original creators or distributors. We provide information about these licenses, but it is your responsibility to understand and comply with the license terms when using any media content.
            </Typography>
            <Typography variant="body1" paragraph>
              We do not guarantee the accuracy of license information provided through our service. You should verify the license terms directly from the original source before using any media content for commercial or other purposes.
            </Typography>
            <Typography variant="body1" paragraph>
              The Open Media Search name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Open Media Search or its affiliates. You must not use such marks without our prior written permission.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">4. User Conduct</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">
                  Use the service in any way that violates any applicable law or regulation.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Use the service to transmit or upload any viruses, malware, or other malicious code.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Attempt to gain unauthorized access to any portion of the service or any other systems or networks connected to the service.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Use any automated means, including scrapers, bots, or spiders, to access the service.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Use the service to collect, harvest, or otherwise obtain personal information about other users.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Interfere with or disrupt the service or servers or networks connected to the service.
                </Typography>
              </li>
            </ul>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">5. Third-Party Services and Links</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Our service may contain links to third-party websites or services that are not owned or controlled by Open Media Search. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </Typography>
            <Typography variant="body1" paragraph>
              You acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
            </Typography>
            <Typography variant="body1" paragraph>
              We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">6. Limitation of Liability</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              To the maximum extent permitted by applicable law, in no event shall Open Media Search or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, business interruption, personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the service, third-party software and/or third-party hardware used with the service, or otherwise in connection with any provision of these Terms), even if we have been advised of the possibility of such damages.
            </Typography>
            <Typography variant="body1" paragraph>
              To the maximum extent permitted by applicable law, we assume no liability or responsibility for any errors, mistakes, or inaccuracies of content; personal injury or property damage, of any nature whatsoever, resulting from your access to and use of our service; any unauthorized access to or use of our secure servers and/or any and all personal information stored therein; any interruption or cessation of transmission to or from the service; any bugs, viruses, trojan horses, or the like that may be transmitted to or through our service by any third party; any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the service.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">7. Governing Law</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              These Terms shall be governed and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law provisions.
            </Typography>
            <Typography variant="body1" paragraph>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">8. Changes to Terms</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page and updating the "last updated" date.
            </Typography>
            <Typography variant="body1" paragraph>
              You are advised to review these Terms periodically for any changes. Changes to these Terms are effective when they are posted on this page. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">9. Contact Us</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              If you have any questions about these Terms, please contact us at:
            </Typography>
            <Typography variant="body1">
              Email: support@openmediasearch.com
            </Typography>
            <Typography variant="body1">
              Address: University of Lincoln, Brayford Pool, Lincoln, LN6 7TS, United Kingdom
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary">dddd
            By using Open Media Search, you acknowledge that you have read these Terms and Conditions and agree to be bound by them.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsAndConditionsPage;