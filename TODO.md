# Fix Plan

## frontend/src/App.jsx
- [ ] Remove duplicate `className` on input
- [ ] Fix `<a>` tag syntax for short URL display
- [ ] Fix copy `<button>` JSX syntax (move props out of children)
- [ ] Fix Tailwind class `btn_success` → `btn-success`, `sm:auto` → `sm:w-auto`
- [ ] Replace `<QRCode />` with `<ReactQRCode />` from `react-qr-code`
- [ ] Fix download `<a>` stray `d` attribute
- [ ] Add missing closing `</div>` and `)}` for conditional block

## backend/routes/url.js
- [ ] Fix import path from `./url.js` to `../Url.js`
- [ ] Remove duplicate `const shortId = nanoid(8);` declaration
- [ ] Fix `new Url.create(...)` → `await Url.create(...)`

