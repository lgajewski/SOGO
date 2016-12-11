package pl.edu.agh.sogo.service;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.spring4.SpringTemplateEngine;

import javax.mail.internet.MimeMessage;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class MailServiceTest {

    @Mock
    private JavaMailSender javaMailSender;

    @Mock
    private MessageSource messageSource;

    @Mock
    private SpringTemplateEngine engine;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private MailService mailService;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
    public void sendEmail() throws Exception {
        String to = "localhost@localhost";
        String subject = "some subject";
        String content = "some content";

        mailService.sendEmail(to, subject, content, false, true);

        verify(javaMailSender).send(any(MimeMessage.class));
    }

}
