import { describe, expect, it } from 'vitest';
import {
  eventTitleFromCaption,
  locationFromCaption,
  looksLikeEventCaption,
  parseEventTimes,
  parseInstagramPost,
} from './instagramParse';

describe('instagramParse', () => {
  it('detects event-like captions', () => {
    expect(looksLikeEventCaption('Photos from our retreat')).toBe(false);
    expect(looksLikeEventCaption('Career workshop — RSVP today')).toBe(true);
  });

  it('parses title, time, location, and host fields', () => {
    const parsed = parseInstagramPost({
      handle: 'bravensjsu',
      host: 'Braven at SJSU',
      shortcode: 'abc123',
      url: 'https://www.instagram.com/p/abc123/',
      takenAt: '2026-10-15T18:00:00.000Z',
      caption:
        'Resume Lab Workshop\nTuesday, November 12 at 5:30pm\nLocation: MLK Library Room 225\nRSVP in bio',
    });
    expect(parsed).not.toBeNull();
    expect(parsed?.title).toBe('Resume Lab Workshop');
    expect(parsed?.host).toBe('Braven at SJSU');
    expect(parsed?.location).toMatch(/MLK Library Room 225/i);
    expect(new Date(parsed!.start).getMonth()).toBe(10);
  });

  it('combines emoji date and time lines and reads the pin location', () => {
    const parsed = parseInstagramPost({
      handle: 'aibsjsu',
      host: 'AI in Business at SJSU',
      shortcode: 'roundtable',
      url: 'https://www.instagram.com/p/roundtable/',
      takenAt: '2026-10-30T21:13:00.000Z',
      caption:
        'There’s no one way into AI.\n\nJoin our Breaking into AI Roundtable and open networking 🤝\n\n' +
        '🗓 Tuesday, November 3\n⏰ 6:00–7:30 PM\n📍 DMH 227\nRSVP through the Linktree!',
    });
    expect(parsed?.location).toBe('DMH 227');
    const start = new Date(parsed!.start);
    const end = new Date(parsed!.end);
    expect([start.getMonth(), start.getDate(), start.getHours()]).toEqual([10, 3, 18]);
    expect([end.getHours(), end.getMinutes()]).toEqual([19, 30]);
  });

  it('reads "@ room" locations without matching @mentions', () => {
    const caption = 'Speaker panel w/ @sjsuacm\nTuesday Nov 3, 6-7:30PM @ BBC 004 👀';
    expect(locationFromCaption(caption)).toBe('BBC 004');
  });

  it('reads "@" and "|" as "at" between date and time', () => {
    const reference = new Date('2026-11-03T01:11:13.000Z');
    const barracuda = parseEventTimes('When: This Friday, Nov 6 @ 4:30 PM', reference);
    const fma = parseEventTimes('📆November 5 | 4:30-5:30 PM\n📍SU 3B', reference);
    expect(barracuda?.start.getHours()).toBe(16);
    expect([fma?.start.getHours(), fma?.end.getHours()]).toEqual([16, 17]);
  });

  it('strips labels from pinned locations', () => {
    expect(locationFromCaption('📍 Where: Tech CU Arena (1500 S. 10th St)')).toBe(
      'Tech CU Arena (1500 S. 10th St)',
    );
  });

  it('shortens long first lines to the first sentence', () => {
    const caption =
      'Join us for an exclusive career night with Pebble Beach Company! 🌴 This year, we are ' +
      'pulling back the curtain on world-class hospitality.';
    expect(eventTitleFromCaption(caption)).toBe(
      'Join us for an exclusive career night with Pebble Beach Company!',
    );
  });

  it('skips recap posts about past events', () => {
    expect(
      looksLikeEventCaption(
        'A huge thank you to all the analysts who joined our workshop this past Tuesday!',
      ),
    ).toBe(false);
  });

  it('ignores month-only dates like monthly calendar posts', () => {
    const parsed = parseInstagramPost({
      handle: 'sjsu.pma',
      host: 'Product Management Association @ SJSU',
      shortcode: 'calendar',
      url: 'https://www.instagram.com/p/calendar/',
      takenAt: '2026-10-01T18:00:00.000Z',
      caption: 'OCTOBER CALENDAR 🗓️\nWorkshops and socials all month long, RSVP in bio!',
    });
    expect(parsed).toBeNull();
  });

  it('extracts zoom locations', () => {
    expect(locationFromCaption('Join us on Zoom for a panel')).toMatch(/Zoom/i);
  });

  it('joins a title that a line break cut off mid-sentence', () => {
    expect(
      eventTitleFromCaption(
        'Want to represent Lurie College at Fall the\n2026 Commencement? Nov 10 at 4pm',
      ),
    ).toBe('Want to represent Lurie College at Fall the 2026 Commencement? Nov 10 at 4pm');
  });

  it('does not join a title to a line after a blank line', () => {
    expect(eventTitleFromCaption('Meet the\n\nJoin us Nov 5 at 4pm')).toBe('Meet the');
  });

  it('skips monthly calendar roundups and officer applications', () => {
    expect(
      looksLikeEventCaption('HELLO, NOVEMBER! | NETS EVENTS CALENDAR\nWorkshop Nov 10 | Panel Nov 14'),
    ).toBe(false);
    expect(
      looksLikeEventCaption('Want to join our team? Spring Officer Applications are open, apply by Dec 5'),
    ).toBe(false);
  });

  it('keeps events that merely mention a calendar link', () => {
    expect(
      looksLikeEventCaption('Resume workshop Nov 10 at 4pm in SU 3B\nAdd it to our events calendar!'),
    ).toBe(true);
  });

  it('uses the first caption line as title', () => {
    expect(eventTitleFromCaption('Info Session: Consulting\nNov 5 at 4pm')).toBe(
      'Info Session: Consulting',
    );
  });
});
