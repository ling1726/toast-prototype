## Lacking
- ✅ no support for multi-window
- ✅ newestOnTop should become 'newestClosestToCentre'
- different toast boundaries
- no support for priorities
- slot code are still in the hooks
- separate between hooks/components/DOM could be better/leaner
  - classNames
  - progress bar
  - theme
- uses findDOMNode
- no tests
- autoClose named timeout

## Scenarios
- ✅ basic
- ✅ maximum number of toasts
- ✅ button to dismiss toast
- ✅ middle toast dismissing earlier based on timeout
- ✅ middle toast dismissing earlier based on button
- ✅ dismiss all toasts 
- ✅ different positions
- ✅ offset
- Updates
- sliding after middle toast is dismissed
- pause on blur
- priority toasts

## ally 

- specific live region, separate for alerts/status, aria-atomic issues
- control narration for each update to a toast
- shortcut to perform action in toast
- alternate means to access toasts - relevant beyond on the screen
- support for keyboard shortcut
