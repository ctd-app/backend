import { Injectable } from '@nestjs/common';
import { EventHandler, HandleEvent } from 'src/services/eventPublisher.service';
import { NotificationService } from 'src/services/notification.service';

// ExampleCreatedEvent
import { ExampleCreatedEvent, ExampleCreatedNotification } from '@common/example/contracts';

@Injectable()
@HandleEvent(ExampleCreatedEvent)
export class ExampleCreatedHandler implements EventHandler<ExampleCreatedEvent> {
    constructor(private readonly notifications: NotificationService) {}

    handle(event: ExampleCreatedEvent) {
        this.notifications.notify(new ExampleCreatedNotification(event.exampleId));
    }
}

// ExampleDeletedEvent
import { ExampleDeletedEvent, ExampleDeletedNotification } from '@common/example/contracts';

@Injectable()
@HandleEvent(ExampleDeletedEvent)
export class ExampleDeletedHandler implements EventHandler<ExampleDeletedEvent> {
    constructor(
        private readonly notifications: NotificationService,
    ) {}

    handle(event: ExampleDeletedEvent) {
        this.notifications.notify(new ExampleDeletedNotification(event.exampleId));
    }
}

// ExampleMetadataUpdatedEvent
import { ExampleMetadataNotification, ExampleMetadataUpdatedEvent } from '@common/example/contracts';

@HandleEvent(ExampleMetadataUpdatedEvent)
@Injectable()
export class ExampleMetadataUpdatedHandler implements EventHandler<ExampleMetadataUpdatedEvent> {
    constructor(
        private readonly notifications: NotificationService,
    ) {}

    handle(event: ExampleMetadataUpdatedEvent) {
        this.notifications.notify(new ExampleMetadataNotification(event.exampleId, event.metadata));
    }
}