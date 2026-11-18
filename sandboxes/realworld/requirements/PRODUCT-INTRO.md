# Conduit: product introduction

**For:** anyone new to Conduit: the BA, testers, demo audiences. **Read time:** about 15 minutes, plus a 10-minute tour of the app.
**Facts about Conduit** come from the RealWorld specification at commit `ebbcdeb8` and the team's running instance. **Facts about other products** come from the sources listed at the end. Sections marked *Product framing* are our interpretation for this project, not part of the specification.

## 1. Conduit in one paragraph

Conduit is a **social blogging platform**: people sign up, write articles, tag them, and read, comment on and favourite other people's articles; they follow authors whose work they like and get a personal feed of those authors' new articles. The RealWorld project, which publishes it, describes it as "the exact same Medium.com clone" built over and over by different developer communities: one shared specification, more than 100 implementations. There is no company and no real users behind it. **In this project we treat it as if it were a real product, and you act as its BA and Product Owner.**

## 2. Business purpose (*Product framing*)

| Who | What they want from Conduit |
|---|---|
| **Writers** (*Author*) | Publish articles quickly, in Markdown, without running their own website; be found by readers; build a following |
| **Readers** (*Visitor*, *Member*) | Find articles worth reading, by topic (tag) or by people they trust (followed authors); react and discuss |
| **The platform** | Grow a community of writers and readers; more good articles attract more readers, more readers attract more writers |

The value of a product like this comes from the **network**: follows, favourites and comments connect writers and readers. Most of Conduit's rules are about who can do what to whose content, and about what each person sees.

## 3. Who uses it

| Persona | Meaning in the stories |
|---|---|
| **Visitor** | Not signed in. Can browse and read, but not write, comment, favourite or follow |
| **Member** | Signed in. Can do everything a visitor can, plus write, comment, favourite and follow |
| **Author** | A member acting on their *own* article or comment: edit or delete it |
| **API consumer** | A developer or client application calling the REST API directly (behind every screen there is an API) |

## 4. What Conduit does

The specification's own feature list is seven lines. Expanded into business capabilities:

| Capability | What a person can do | Where (page) |
|---|---|---|
| **Account** | Sign up; sign in; change name, email, password, bio and picture; sign out | `/register`, `/login`, `/settings` |
| **Profiles** | See a member's picture and bio, their articles, and the articles they favourited; follow or unfollow them | `/profile/<name>`, `/profile/<name>/favorites` |
| **Publishing** | Write an article (title, short description, body in Markdown, tags); edit or delete your own | `/editor`, `/editor/<article>` |
| **Reading** | Open an article; the Markdown is shown formatted; comments appear below it | `/article/<article>` |
| **Discovery** | Global feed (all articles, newest first); *Your Feed* (only authors you follow); filter by tag; popular tags; pages of results | `/` (home) |
| **Engagement** | Favourite an article (a heart with a count); comment; delete your own comment; follow authors | article page, lists, profiles |

**Deliberately limited by the specification:** accounts cannot be deleted ("no deleting required"), and comments cannot be edited ("no updating required").

## 5. Similar products on the market

| Product | What it is | Signature features |
|---|---|---|
| **Medium** | General publishing platform with a large readership | Follow writers and topics; claps and responses (comments); paid membership; writers paid through its Partner Program |
| **DEV Community** (dev.to) | Community blogging for software developers | Follow tags and people; several reaction types; up to four tags per post; reading list (save for later) |
| **Hashnode** | Blogging platform for developers and teams | Blog on your own domain; built-in newsletter; team blogs |
| **Substack** | Newsletter-first publishing | Posts delivered by email; free and paid subscriptions; comments and a short-form *Notes* feed |

Conduit is closest to **Medium** and **DEV**: one shared site, a public feed, tags, follows, a "like" reaction and comments.

## 6. Typical business functions vs Conduit

| Business function | Typical in the market | In Conduit |
|---|---|---|
| Accounts and public profiles | Yes | **Yes** |
| Write and publish with formatting | Yes | **Yes** (Markdown) |
| Topics / tags | Yes | **Yes** (tags on articles, tag filter; you cannot follow a tag) |
| Follow people | Yes | **Yes** |
| Personal feed | Yes, usually ranked by an algorithm | **Yes**, simply newest first |
| Like / reaction | Yes, often several kinds | **Yes**, one: favourite |
| Comments | Yes, often threaded and editable | **Yes**, flat; delete only, no editing |
| Save for later / reading list | Common | **No** (favourites are public, not a private list) |
| Search | Yes | **No** |
| Drafts, scheduling | Common | **No**: publishing is immediate |
| Notifications, email digests, newsletter | Common | **No** |
| Paid membership, paywall, writer payouts | Common | **No** |
| Moderation, reporting, blocking | Yes | **No** |
| Statistics for writers | Common | **No** |
| Custom domain, branding | Some products | **No** |
| Delete my account | Yes | **No**, by design |

### Scope rule for the review

The "No" rows are **out of scope by design**. Conduit is a deliberately small product, and its value for this project is that every rule can be checked. When you review, **do not raise a missing market feature as a gap** (no search, no notifications, and so on). Raise something as missing only if **one of the capabilities in section 4 does not work without it**. For example, "there is no way to see which tags exist before filtering" would count; "there is no search" would not.

## 7. Ten-minute tour

Use the team's instance: **https://web-vs-pro-batc-qe-realworld-sandbox-f4crcjf2bcg9c5b6.swedencentral-01.azurewebsites.net/**. Data there is shared and may be reset; use made-up details.

1. **Home** as a visitor: Global Feed, popular tags, pages of articles. (If the site is empty, that's normal after a reset.)
2. **Sign up** with a made-up account (an email ending `@example.invalid`).
3. **New Article**: write a title, a description, a body with a heading in Markdown, two tags. Publish and open it.
4. **Edit** it, then look at the address bar: the article's address follows its title.
5. Sign out (button on the **Settings** page), **sign up a second account**, open the first account's article: **favourite** it and **comment** on it.
6. Open the first author's **profile**: **follow** them, then go home and open **Your Feed**.

Stop there. **Don't explore edge cases yet** (someone else's content, empty fields, wrong passwords). Those are the open questions you will decide, and the review guide asks you to decide first and check the app afterwards.

## 8. Words you will meet

| Word | Meaning |
|---|---|
| **Article** | A post: title, short description, body, tags |
| **Slug** | The article's address in the URL, derived from its title (e.g. `/article/my-first-post`) |
| **Tag** | A topic label on an article; used for filtering |
| **Global Feed / Your Feed** | All articles, newest first / only articles by authors you follow |
| **Favourite** | Conduit's single "like"; each article shows how many people favourited it |
| **Follow** | Subscribe to an author so their new articles reach Your Feed |
| **Markdown** | A simple text format (`## heading`, `*italic*`) that the app shows formatted |
| **API** | The interface the web pages use behind the scenes; the specification defines both the screens and the API |

## Sources

- RealWorld specification at commit `ebbcdeb8`: [introduction](https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/introduction.mdx), [features](https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md), [routing](https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md), [README](https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/README.md)
- Medium: [Using Medium (help centre)](https://help.medium.com/hc/en-us/articles/225168028-Getting-started-with-Medium), [features overview](https://toolquestor.com/tool/medium)
- DEV Community: [Customizing your feed (help)](https://dev.to/help/customizing-your-feed), [DEV.to features](https://dev.to/siswoyo/10-devto-features-every-member-should-know-l48), [tags per post](https://www.poster.ly/guides/devto-guide)
- Hashnode: [Hashnode blogs](https://hashnode.com/products/blogs)
- Substack: [Britannica: Substack](https://www.britannica.com/topic/Substack), [TechRadar review](https://www.techradar.com/pro/website-building/substack-review)
