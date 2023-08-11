/**
 * @file  Broser.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   Aug 9, 2023
 *
 * @description Defines utility functions for interacting with the browser.
 */

export function navigateTo(url: string, newTab: boolean = false): void
{
  window.open(url, newTab ? "_blank" : "_self");
}
