# How To Update The Logi Bears Website

This guide is for someone updating the website in GitHub using only a web browser.

You do not need to install anything.

## The Two Files You Will Usually Edit

- `schedule.csv` updates where the truck will be.
- `menu.csv` updates the food menu.

Do not rename these files.

Do not change the first line in either file. The first line is the list of column names.

## How To Edit A File In GitHub

1. Go to GitHub and sign in.
2. Open the Logi Bears website repository.
3. Click the file you want to update:
   - `schedule.csv`
   - `menu.csv`
4. Click the pencil icon or `Edit this file`.
5. Make your changes.
6. Click `Commit changes...`.
7. In the message box, type a short note, like:
   - `Update schedule`
   - `Update menu`
   - `Change menu prices`
8. Click `Commit changes`.
9. Wait a few minutes.
10. Open the website and refresh the page.

If GitHub asks you to create a branch or pull request, stop and ask the site owner for help.

## Very Important CSV Rules

These files look like spreadsheets, but they are plain text.

Each line is one item.

Each part is separated by a comma.

If something has a comma inside it, put quotes around the whole thing.

Good:

```csv
2026-06-05,05:00 PM - 11:00 PM,Marcellus Park,"Marcellus Park Platt Road, Marcellus, NY",Join us at the event.
```

Bad:

```csv
2026-06-05,05:00 PM - 11:00 PM,Marcellus Park,Marcellus Park Platt Road, Marcellus, NY,Join us at the event.
```

The bad example breaks because the address has a comma but no quotes.

## Updating The Schedule

Open this file:

```text
schedule.csv
```

The first line looks like this:

```csv
date,time,location,address,notes
```

Leave that line alone.

Each event goes on its own line.

Example:

```csv
2026-06-05,05:00 PM - 11:00 PM,Marcellus Park - Olde Home Days,"Marcellus Park Platt Road, Marcellus, NY",Join us at Olde Home Days.
```

What each part means:

- `date`: The event date. Use this format: `2026-06-05`
- `time`: The event time. Example: `05:00 PM - 11:00 PM`
- `location`: The event name or place name.
- `address`: The address. Put quotes around it if it has commas.
- `notes`: A short note customers will see.

To add a new event:

1. Go to the bottom of `schedule.csv`.
2. Add a new line.
3. Type the event using the same format as the other lines.
4. Save it by clicking `Commit changes`.

To remove an event:

1. Find the event line.
2. Delete the whole line.
3. Save it by clicking `Commit changes`.

Good to know:

- Old events disappear from the website automatically.
- The website sorts events by date automatically.
- If there are no future events, the website shows a message saying there are no upcoming stops.

## Updating The Menu

Open this file:

```text
menu.csv
```

The first line looks like this:

```csv
category_order,category_id,category_label,category_badge,item_order,item_name,description,price
```

Leave that line alone.

Each menu item goes on its own line.

Example:

```csv
1,paninis,Paninis,Free chips with panini purchase,1,Philly w/ Attitude,"Steak, onions, peppers, cherry peppers, mushrooms, cheese",$17
```

The easiest way to add a menu item:

1. Find a similar item in the same section.
2. Copy that whole line.
3. Paste it as a new line.
4. Change only the item name, description, price, and item order.
5. Save it by clicking `Commit changes`.

To change a price:

1. Find the menu item.
2. Change the price at the end of the line.
3. Save it by clicking `Commit changes`.

Example:

```csv
$16
```

To remove a menu item:

1. Find the menu item line.
2. Delete the whole line.
3. Save it by clicking `Commit changes`.

## Menu Sections

The menu currently has these sections:

```text
Paninis
Breakfast
Appetizers
Beverages
```

Try not to change the section names unless the site owner asks you to.

For menu items:

- `category_order` controls the order of the big sections.
- `item_order` controls the order of items inside a section.
- `price` should include the dollar sign, like `$12`.
- If the description has commas, put quotes around the whole description.

## After You Save

After clicking `Commit changes`:

1. Wait 1 to 5 minutes.
2. Open the website.
3. Refresh the page.
4. Check your update.

If you still see the old version:

- Refresh again.
- On a phone, close the browser tab and open the website again.
- If that still does not work, ask the site owner for help.

## Ask For Help If

Ask the site owner for help if:

- GitHub will not let you save.
- GitHub mentions a branch or pull request.
- The website looks broken after your change.
- A menu item or event does not show up.
- You are not sure where to type something.

When in doubt, stop and ask before saving.
