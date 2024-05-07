import config from '../config';

export class PaginationView {
  private mainElement = document.querySelector('#main')!;
  public currentOffset = 0;

  render(hasNextPage: boolean, hasPrevPage: boolean) {
    this.remove();
    this.mainElement.insertAdjacentHTML(
      'beforeend',
      this.getMarkupForPagination(hasNextPage, hasPrevPage),
    );
  }

  remove() {
    const pagination = document.querySelector('#pagination');
    if (!pagination) return;
    pagination.remove();
  }

  addNextPageHandler(handler: (offset: number) => void) {
    const nextButton = document.querySelector('#next');
    if (!nextButton) return;
    nextButton.addEventListener('click', () => {
      if (this.currentOffset === 0) {
        this.currentOffset = -1;
      }
      this.currentOffset += config.listingPage.defaultPlaylistRenderCount;
      handler(this.currentOffset);
    });
  }

  addPrevPageHandler(handler: (offset: number) => void) {
    const prevButton = document.querySelector('#prev');
    if (!prevButton) return;
    prevButton.addEventListener('click', () => {
      this.currentOffset -= config.listingPage.defaultPlaylistRenderCount;
      if (this.currentOffset < 0) this.currentOffset = 0;
      handler(this.currentOffset);
    });
  }

  toggleButtonActiveState(on: boolean, type: 'prev' | 'next') {
    const button = document.querySelector(`#${type}`);
    if (!on) {
      button?.setAttribute('disabled', '');
      return;
    }
    button?.removeAttribute('disabled');
  }

  private getMarkupForPagination(
    hasNextPage: boolean,
    hasPrevPage: boolean,
  ): string {
    return `
    <div id="pagination" class="mb-10 flex items-center justify-center lg:mb-24">
        <nav class="flex items-center gap-x-1">
        <button
            type="button"
            id="prev"
            ${hasPrevPage ? '' : 'disabled'}
            class="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-1.5 rounded-lg px-2.5 py-2 text-base hover:bg-[#22c55e] hover:text-[#09090b] focus:bg-[#22c55e] focus:outline-none disabled:pointer-events-none disabled:opacity-50  dark:hover:bg-[#22c55e] dark:focus:bg-[#22c55e] focus:text-[#09090b]"
        >
            <i class="fa-solid fa-arrow-left hover:text-white "></i>  
            <span>Previous</span>
        </button>
    
        <button
            type="button"
            id="next"
            ${hasNextPage ? '' : 'disabled'}
            class="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-1.5 rounded-lg px-2.5 py-2 text-base hover:bg-[#22c55e] hover:text-[#09090b] focus:text-[#09090b] focus:bg-[#22c55e] focus:outline-none disabled:pointer-events-none disabled:opacity-50  dark:hover:bg-[#22c55e] dark:focus:bg-[#22c55e]"
        >
            <span>Next</span>
            <i class="fa-solid fa-arrow-right hover:text-white "></i>  
        </button>
    </nav>
    </div>
    `;
  }
}
