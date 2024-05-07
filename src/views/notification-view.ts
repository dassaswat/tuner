import { NotificationData, NotificationType } from '../types';

export class NotificationView {
  private notificationElement = document.querySelector('#notification')!;
  render(type: NotificationType, data: NotificationData) {
    this.remove();

    if (type === 'error') {
      this.notificationElement.insertAdjacentHTML(
        'afterbegin',
        this.getMarkupForErrorNotification(data.description),
      );
    } else {
      this.notificationElement.insertAdjacentHTML(
        'afterbegin',
        this.getMarkupForSuccessNotification(
          data.header ?? 'Success',
          data.description,
        ),
      );
    }

    this.notificationElement.classList.remove('-translate-y-full', 'opacity-0');
    this.notificationElement.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      this.notificationElement.classList.remove('translate-y-0', 'opacity-100');
      this.notificationElement.classList.add('-translate-y-full', 'opacity-0');
    }, 5000);
  }

  remove() {
    if (!this.notificationElement) return;
    this.notificationElement.innerHTML = '';
  }

  private getMarkupForSuccessNotification(header: string, description: string) {
    return `
    <div role="alert" class="rounded-xl border border-black bg-[#1c1917] p-4">
      <div class="flex items-start gap-4">
        <span class="text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
    
        <div class="flex-1">
          <strong class="block font-medium "> ${header} </strong>
          <p class="mt-1 text-sm opacity-60">${description}</p>
        </div>
      </div>
    </div>
    `;
  }

  private getMarkupForErrorNotification(description: string) {
    return `
    <div role="alert" class="rounded border-s-4 border-[#ef4444] bg-[#fafafa] p-4">
        <div class="flex items-center gap-2 text-red-800">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                <path
                fill-rule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clip-rule="evenodd"
                />
            </svg>
            <strong class="block font-medium"> Something went wrong </strong>
        </div>
        <p class="mt-2 text-sm text-[#ef4444]">
            ${description}
        </p>
    </div>
    `;
  }
}
