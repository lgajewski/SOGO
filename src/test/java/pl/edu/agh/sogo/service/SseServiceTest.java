package pl.edu.agh.sogo.service;

import org.junit.Before;
import org.junit.Test;
import org.mockito.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.function.Supplier;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.mockito.Mockito.*;


public class SseServiceTest {

    @Mock
    private Supplier<SseEmitter> sseEmitterSupplier;

    @Mock
    private SseEmitter sseEmitterMock;

    @InjectMocks
    private SseService sseService;

    @Captor
    private ArgumentCaptor<SseEmitter.SseEventBuilder> captor;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);

        when(sseEmitterSupplier.get()).thenReturn(sseEmitterMock);
    }

    @Test
    public void provide() throws Exception {
        assertEquals(sseService.provide(), sseEmitterMock);
        assertEquals(sseService.provide(), sseEmitterMock);
    }

    @Test
    public void emitWhenNothingProvided() throws Exception {
        sseService.emit("event", "some object");

        verifyZeroInteractions(sseEmitterMock);
    }

    @Test
    public void emit() throws Exception {
        // provide something first
        sseService.provide();

        sseService.emit("event", "something");

        verify(sseEmitterMock).send(captor.capture());

        // check that sent data is not empty
        SseEmitter.SseEventBuilder sseEventBuilder = captor.getValue();
        assertFalse(sseEventBuilder.build().isEmpty());
    }

    @Test
    public void testMultipleEmit() throws Exception {
        SseEmitter sseEmitter1 = mock(SseEmitter.class);
        SseEmitter sseEmitter2 = mock(SseEmitter.class);
        SseEmitter sseEmitter3 = mock(SseEmitter.class);

        // return other instance of mock every time
        when(sseEmitterSupplier.get()).thenReturn(sseEmitter1);
        sseService.provide();
        when(sseEmitterSupplier.get()).thenReturn(sseEmitter2);
        sseService.provide();
        when(sseEmitterSupplier.get()).thenReturn(sseEmitter3);
        sseService.provide();

        // emit three events
        sseService.emit("event1", new Object());
        sseService.emit("event1", new Object());
        sseService.emit("event2", new Object());

        verify(sseEmitter1, times(3)).send(any());
        verify(sseEmitter2, times(3)).send(any());
        verify(sseEmitter3, times(3)).send(any());
    }

    @Test
    public void testEmitterThatFail() throws Exception {
        SseEmitter sseEmitter1 = mock(SseEmitter.class);
        SseEmitter sseEmitter2 = mock(SseEmitter.class);

        // return other instance of mock every time
        when(sseEmitterSupplier.get()).thenReturn(sseEmitter1);
        sseService.provide();
        when(sseEmitterSupplier.get()).thenReturn(sseEmitter2);
        sseService.provide();

        // pretend exception
        doThrow(new NullPointerException()).when(sseEmitter1).send(any());
        sseService.emit("event1", new Object());
        sseService.emit("event2", new Object());

        verify(sseEmitter1, times(1)).send(any());
        verify(sseEmitter2, times(2)).send(any());
    }

}
