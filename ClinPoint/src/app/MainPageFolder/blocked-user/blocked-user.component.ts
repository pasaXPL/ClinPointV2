import { Component } from '@angular/core';

@Component({
  selector: 'app-blocked-user',
  templateUrl: './blocked-user.component.html',
  styleUrls: ['./blocked-user.component.scss']
})
export class BlockedUserComponent {
  faqs = [
    {
      question: "What should I do if I am running late for my appointment?",
      answer: "If you will be running late, leave earlier, and consider factors like traffic or public transportation delays. Being late may impact the duration of your appointment or, in some cases, may require rescheduling."
    },
    {
      question: "Can I cancel my appointment?",
      answer: "Unfortunately, our cancellation policy requires that appointments be canceled or rescheduled at least 2 hours before the scheduled time. We appreciate your understanding as this helps us manage our schedule effectively and ensures that we can accommodate other patients on time."
    },
    {
      question: "How do I schedule an appointment?",
      answer: "You can visit ClinPoint clinic schedule for more information on appointment scheduling options."
    },
    {
      question: "Are walk-in appointments available?",
      answer: "While clinics offer walk-in services, we recommend scheduling appointments online for increased efficiency."
    },
    {
      question: "Where do I pay for my consultation after scheduling an appointment online?",
      answer: "Payment for your consultation at the clinic."
    },
    {
      question: "Can I receive a reminder for my appointment?",
      answer: "Yes, we can send you appointment reminders via notification to help you stay informed."
    },
    {
      question: "How early should I arrive for my appointment?",
      answer: "We recommend arriving at least 15 minutes before your scheduled appointment time. Please note that ClinPoint will be notified within 2 hours before the appointment."
    },
    {
      question: "What should I bring when I go to the clinic?",
      answer: "Show your online appointment schedule in ClinPoint to the secretary."
    }
  ];
}
