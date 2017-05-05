// html templates and elements
const toolbarSelector = `
<div class="toolbar__selector">
    <input type="color" />
    <input type="text" />
    <button class="btn">&times;</button>
</div>
`;
const overlay = `<div class="overlay"><button>&times;</button></div>`;
const toolbar = $(`
<div class="toolbar">
    <div class="toolbar__title">Your CSS Selectors</div>
    <div class="toolbar__content"></div>
    <button class="btn btn--block addToolbarBtn">+ Add Selector</button>
</div>`
);
const extension = $(`<div class="extension"></div>`);
const overlayContainer = $(`<div class="overlay-container"></div>`);

// append content into the DOM
$('body').append(extension);
extension.append(toolbar);
extension.append(overlayContainer);

// vars and elements
const toolbarContent = toolbar.find('.toolbar__content');
const colors = ['#ffc0cb','#008080','#ff0000','#00ffff','#40e0d0','#800080','#fff68f','#003366'];
let nextColor = 0;
let selectorList = [];
let overlayId = 0;

// set up event handlers
toolbar.find('.addToolbarBtn').click(addSelector);

/**
 * Add Selector
 */
function addSelector() {
  let newToolbarSelector = $(toolbarSelector);
  selectorList.push('');
  // set color and event on change
  newToolbarSelector.children('input[type=color]')
      .val(colors[nextColor])
      .change(changeColor);
  // set delete event
  newToolbarSelector.children('.btn').click(removeSelector);
  // set input change event
  newToolbarSelector.children('input[type=text]').keyup(changeSelector);
  toolbarContent.append(newToolbarSelector);
  nextColor++;
  if (nextColor == colors.length) {
    nextColor = 0;
  }
}

/**
 * Remove Overlay
 * @param {event} e
 */
function removeOverlay(e) {
  $(e.target).parent().remove();
}

/**
 * Remove Selector
 * @param {event} e
 */
function removeSelector(e) {
  let selectorIndex = getSelectorIndex(e.target);
  // remove all selector overlays
  if (selectorList[selectorIndex]) {
    $(`.${selectorList[selectorIndex]}`).remove();
  }
  selectorList.splice(selectorIndex, 1);
  $(e.target).parent().remove();
}

/**
 * Get Selector Index
 * @param target
 * @return {*|jQuery} index
 */
function getSelectorIndex(target) {
  return $('.toolbar__selector').index($(target).parent())
}

/**
 * Add Overlay
 * @param el
 * @param input
 */
function addOverlay(el, input) {
  let rect = el.getBoundingClientRect();
  let newOverlay = $(overlay);
  // add class so we can identify it later
  newOverlay.addClass(`__overlay__${overlayId}`);
  // add remove event to button
  newOverlay.find('button').click(removeOverlay);
  // add css properties to element
  newOverlay.css({
    backgroundColor: $(input).prev().val(),
    top: rect.top,
    left: rect.left,
    height: rect.height,
    width: rect.width
  });
  overlayContainer.append(newOverlay);
}

/**
 * Change Selector
 * debounced function
 */
const changeSelector = debounce(e => {
  if (e.target.value) {
    // clean up old overlays
    let selectorIndex = getSelectorIndex(e.target);
    if (selectorList[selectorIndex]) {
      $(`.${selectorList[selectorIndex]}`).remove();
    }
    // add new overlays
    $(e.target.value).each((i, el) => {
      if (i < 20) {
        addOverlay(el, e.target);
      }
    });
    selectorList[selectorIndex] = `__overlay__${overlayId}`;
    overlayId++;
  }
}, 600);

/**
 * change Color
 * debounced function
 */
const changeColor = debounce(e => {
  let selectorIndex = getSelectorIndex(e.target);
  if (selectorList[selectorIndex]) {
    $(`.${selectorList[selectorIndex]}`).css({
      backgroundColor: e.target.value
    });
  }
}, 600);