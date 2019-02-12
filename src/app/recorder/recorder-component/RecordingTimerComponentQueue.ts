import {RecordingTimerComponent} from '../recording-timer/recording-timer.component'
import {RecordingTimer} from '../types/RecordingTimer'

export class RecordingTimerComponentQueue implements RecordingTimer {
  private methodCalls = []

  applyQueuedMethods(realComponent: RecordingTimerComponent) {
    this.methodCalls.forEach(command => {
      realComponent[command]()
    })
    this.methodCalls = []
  }

  restartTimer() {
    this.methodCalls.push('restartTimer')
  }

  startTimer() {
    this.methodCalls.push('startTimer')
  }

  stopTimer() {
    this.methodCalls.push('stopTimer')
  }
}
