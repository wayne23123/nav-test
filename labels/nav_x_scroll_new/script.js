(function () {
  const tmp = document.getElementById('nav_x-hide');
  const cover = document.getElementById('ios-status-cover');
  const isIOS = document.documentElement.classList.contains('is-ios');

  const THRESHOLD = 300;
  let visible = false;

  function closeMoreLists() {
    const list = document.querySelector('#nav_x-more-item-list');
    const fixedList = document.querySelector('#nav_x-more-item-list-fixed');

    if (list) list.style.display = 'none';
    if (fixedList) fixedList.style.display = 'none';
  }

  function onScroll() {
    if (!tmp) return;

    const y = window.pageYOffset || document.documentElement.scrollTop || 0;
    const shouldShow = y >= THRESHOLD;

    if (shouldShow !== visible) {
      tmp.style.display = shouldShow ? 'block' : 'none';

      if (cover && isIOS) {
        cover.style.display = shouldShow ? 'block' : 'none';
      }

      closeMoreLists();
      visible = shouldShow;
    }
  }

  function toggleMore(buttonId, listId) {
    const button = document.getElementById(buttonId);
    const moreList = document.getElementById(listId);

    if (!button || !moreList) return;

    const isOpen = moreList.style.display === 'flex';

    if (isOpen) {
      moreList.style.display = 'none';
      return;
    }

    const buttonRect = button.getBoundingClientRect();

    moreList.style.display = 'flex';

    const listRect = moreList.getBoundingClientRect();
    const gap = 8;

    let leftPosition = buttonRect.right - listRect.width;

    if (leftPosition < 0) {
      leftPosition = 0;
    }

    if (leftPosition + listRect.width > window.innerWidth) {
      leftPosition = window.innerWidth - listRect.width;
    }

    moreList.style.top = `${buttonRect.bottom + gap}px`;
    moreList.style.left = `${leftPosition}px`;
    moreList.scrollTop = 0;
  }

  window.navXToggleMore = function () {
    toggleMore('nav_x-seemore', 'nav_x-more-item-list');
  };

  window.navXToggleMoreFixed = function () {
    toggleMore('nav_x-seemore-fixed', 'nav_x-more-item-list-fixed');
  };

  const seemore = document.getElementById('nav_x-seemore');
  const seemoreFixed = document.getElementById('nav_x-seemore-fixed');

  if (seemore) {
    seemore.addEventListener('click', window.navXToggleMore);
  }

  if (seemoreFixed) {
    seemoreFixed.addEventListener('click', window.navXToggleMoreFixed);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();