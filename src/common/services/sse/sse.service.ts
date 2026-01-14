import { Injectable, MessageEvent } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SseService {
  private clients = new Map<string, Subject<MessageEvent>>();

  connect(userId: string): Observable<MessageEvent> {
    const subject = new Subject<MessageEvent>();
    this.clients.set(userId, subject);
    console.log('clients', this.clients);

    return subject.asObservable();
  }

  disconnect(userId: string) {
    this.clients.get(userId)?.complete();
    this.clients.delete(userId);
  }

  emit(userId: string, event: MessageEvent) {
    this.clients.get(userId)?.next(event);
  }
}
