# Logi Bears Food Truck Website

Public website for Logi Bears, a family owned food truck based in Syracuse, NY. The site highlights the food truck story, menu, food photos, upcoming schedule, catering, and social media. 

Live site:

https://thelogibears.com/

## What This Site Uses

This is a static website built with:

- HTML
- CSS
- JavaScript
- Bootstrap from a CDN
- CSV files for editable content
- Web3Forms for the catering contact form

There is no custom backend application or database.

## Main Files

- `index.html` - page content, metadata, SEO tags, and site structure
- `styles.css` - layout, responsive design, and visual styling
- `script.js` - loads menu, schedule, and food photos from CSV files
- `menu.csv` - menu categories and menu items
- `schedule.csv` - upcoming food truck stops
- `food-photos.csv` - slideshow photo captions and image references
- `assets/` - logo, favicon, and food photos
- `robots.txt` - crawler instructions
- `sitemap.xml` - sitemap for search engines
- `CONTENT_UPDATE_INSTRUCTIONS.md` - non-technical instructions for updating CSV content through GitHub

## Contact Form

The catering request form submits through Web3Forms.Invoices will not be itemized and there is a travel fee for anything over 15 miles.

The Web3Forms access key is stored in `index.html` as a hidden `access_key` field. If the key ever needs to be changed, replace the value in this line:

```html
<input type="hidden" name="access_key" value="...">
```

The form posts to:

```text
https://api.web3forms.com/submit
```

The form also includes hCaptcha spam protection using Web3Forms' free-plan hCaptcha site key. In the Web3Forms dashboard, make sure hCaptcha is enabled for this form so submissions are checked server-side as well as in the browser.

## Content Updates

Most routine updates should happen in CSV files:

- Update menu items in `menu.csv`
- Update upcoming stops in `schedule.csv`
- Update slideshow photos in `food-photos.csv` and `assets/food/`

For step-by-step browser-only instructions, see:

[CONTENT_UPDATE_INSTRUCTIONS.md](CONTENT_UPDATE_INSTRUCTIONS.md)

## Local Preview

Because the site loads CSV files with JavaScript, preview it through a local web server instead of opening `index.html` directly.

One simple option from the repo folder:

```powershell
python -m http.server 8080
```

Then open:

```text
http://127.0.0.1:8080/
```

## Schedule Behavior

The schedule is loaded from `schedule.csv`.

- Past events are hidden automatically.
- Events are sorted by date.
- If no upcoming events exist, the site shows a friendly empty-state message.

Required schedule columns:

```csv
date,time,location,address,notes
```

## Menu Behavior

The menu is loaded from `menu.csv`.

- Categories are grouped by `category_id`.
- Categories are ordered by `category_order`.
- Items are ordered by `item_order`.

Required menu columns:

```csv
category_order,category_id,category_label,category_badge,item_order,item_name,description,price
```

## SEO Notes

The site includes:

- Local Syracuse and Central New York page copy
- Meta description and social preview tags
- Canonical URL
- Local business structured data
- Sitemap
- Robots file

For best local search visibility, keep the schedule, menu, photos, and business profile links current.

## Deployment

This repo is intended to be hosted as a static site. After changes are committed and deployed, refresh the live site to confirm the update.

Some browsers and phones cache files aggressively. If a change does not appear right away, wait a few minutes and refresh again or test in a private/incognito window.
