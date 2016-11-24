package pl.edu.agh.sogo.service.event;

import org.springframework.context.ApplicationEvent;

public class UpdateEvent extends ApplicationEvent {

    private final String name;
    private final Object object;

    /**
     * Create a new ApplicationEvent.
     *
     * @param source the object on which the event initially occurred (never {@code null})
     */
    public UpdateEvent(Object source, String name, Object object) {
        super(source);
        this.name = name;
        this.object = object;
    }

    public String getName() {
        return name;
    }

    public Object getObject() {
        return object;
    }
}
