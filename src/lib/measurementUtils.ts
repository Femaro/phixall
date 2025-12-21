/**
 * Measurement unit utilities for US and international users
 * US: Imperial (feet, inches, pounds, Fahrenheit)
 * International: Metric (meters, centimeters, kilograms, Celsius)
 */

/**
 * Convert and format length
 */
export function formatLength(
  valueInMeters: number,
  isUS: boolean | null,
  precision: number = 1
): string {
  if (isUS === null) {
    return `${valueInMeters.toFixed(precision)} m`;
  }

  if (isUS) {
    // Convert meters to feet
    const feet = valueInMeters * 3.28084;
    if (feet < 1) {
      const inches = feet * 12;
      return `${inches.toFixed(0)} in`;
    }
    return `${feet.toFixed(precision)} ft`;
  }

  return `${valueInMeters.toFixed(precision)} m`;
}

/**
 * Convert and format weight
 */
export function formatWeight(
  valueInKg: number,
  isUS: boolean | null,
  precision: number = 1
): string {
  if (isUS === null) {
    return `${valueInKg.toFixed(precision)} kg`;
  }

  if (isUS) {
    // Convert kg to pounds
    const pounds = valueInKg * 2.20462;
    return `${pounds.toFixed(precision)} lbs`;
  }

  return `${valueInKg.toFixed(precision)} kg`;
}

/**
 * Convert and format temperature
 */
export function formatTemperature(
  valueInCelsius: number,
  isUS: boolean | null,
  precision: number = 0
): string {
  if (isUS === null) {
    return `${valueInCelsius.toFixed(precision)}°C`;
  }

  if (isUS) {
    // Convert Celsius to Fahrenheit
    const fahrenheit = (valueInCelsius * 9) / 5 + 32;
    return `${fahrenheit.toFixed(precision)}°F`;
  }

  return `${valueInCelsius.toFixed(precision)}°C`;
}

/**
 * Get length unit label
 */
export function getLengthUnit(isUS: boolean | null): string {
  return isUS ? 'ft' : 'm';
}

/**
 * Get weight unit label
 */
export function getWeightUnit(isUS: boolean | null): string {
  return isUS ? 'lbs' : 'kg';
}

/**
 * Get temperature unit label
 */
export function getTemperatureUnit(isUS: boolean | null): string {
  return isUS ? '°F' : '°C';
}

