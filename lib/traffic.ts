import type { TrafficLevel } from './types';

type IndicatorKey = 'TWTM' | 'TWCP';

type IndicatorRecord = {
  locationId: string;
  destinationId: string;
  colourId: string;
  journeyData: string;
  journeyDesc: string;
};

const JTI_XML_URL = 'https://resource.data.one.gov.hk/td/jss/Journeytimev2.xml';

const TARGET_INDICATORS: Record<IndicatorKey, { locationId: string; destinationId: string }> = {
  TWTM: { locationId: 'SJ5', destinationId: 'TWTM' },
  TWCP: { locationId: 'SJ5', destinationId: 'TWCP' },
};

function tagValue(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'));
  return (match?.[1] ?? '').trim();
}

function parseIndicatorRecords(xml: string): IndicatorRecord[] {
  const blocks = Array.from(
    xml.matchAll(/<jtis_journey_time>[\s\S]*?<\/jtis_journey_time>/gi),
    (match) => match[0],
  );

  return blocks
    .map((block) => ({
      locationId: tagValue(block, 'LOCATION_ID'),
      destinationId: tagValue(block, 'DESTINATION_ID'),
      journeyData: tagValue(block, 'JOURNEY_DATA'),
      colourId: tagValue(block, 'COLOUR_ID'),
      journeyDesc: tagValue(block, 'JOURNEY_DESC'),
    }))
    .filter((record) => record.locationId && record.destinationId);
}

function levelFromColourId(colourIdRaw: string): TrafficLevel | null {
  const colourId = Number.parseInt(colourIdRaw, 10);

  if (Number.isNaN(colourId)) {
    return null;
  }

  if (colourId <= 1) {
    return 'LIGHT';
  }

  if (colourId === 2) {
    return 'MODERATE';
  }

  return 'HEAVY';
}

function levelFromFallbackFields(record: IndicatorRecord): TrafficLevel {
  const desc = record.journeyDesc.toLowerCase();
  const data = Number.parseFloat(record.journeyData);

  if (desc.includes('heavy') || desc.includes('congestion') || (!Number.isNaN(data) && data >= 25)) {
    return 'HEAVY';
  }

  if (desc.includes('slow') || (!Number.isNaN(data) && data >= 12)) {
    return 'MODERATE';
  }

  return 'LIGHT';
}

function toLevel(record: IndicatorRecord): TrafficLevel {
  return levelFromColourId(record.colourId) ?? levelFromFallbackFields(record);
}

function worseLevel(a: TrafficLevel, b: TrafficLevel): TrafficLevel {
  const rank: Record<TrafficLevel, number> = {
    UNKNOWN: 0,
    LIGHT: 1,
    MODERATE: 2,
    HEAVY: 3,
  };

  return rank[a] >= rank[b] ? a : b;
}

export async function fetchTrafficLevel(): Promise<{ traffic: TrafficLevel }> {
  const controller = new AbortController();
  const timeoutMs = 3000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(JTI_XML_URL, { cache: 'no-store', signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Journey Time XML request failed: ${response.status}`);
  }

  const xml = await response.text();
  const records = parseIndicatorRecords(xml);

  const levels: TrafficLevel[] = [];

  for (const { locationId, destinationId } of Object.values(TARGET_INDICATORS)) {
    const record = records.find(
      (item) => item.locationId === locationId && item.destinationId === destinationId,
    );

    if (!record) {
      throw new Error(`Journey Time indicator missing: ${locationId} -> ${destinationId}`);
    }

    levels.push(toLevel(record));
  }

  return {
    traffic: levels.reduce(worseLevel),
  };
}
