/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai_designChat from "../ai/designChat.js";
import type * as ai_evaluateScreenshot from "../ai/evaluateScreenshot.js";
import type * as ai_generateQuestions from "../ai/generateQuestions.js";
import type * as ai_generateSiteSpec from "../ai/generateSiteSpec.js";
import type * as ai_imageSearch from "../ai/imageSearch.js";
import type * as domains from "../domains.js";
import type * as feedback from "../feedback.js";
import type * as http from "../http.js";
import type * as imageCache from "../imageCache.js";
import type * as intakeResponses from "../intakeResponses.js";
import type * as pipelineLogs from "../pipelineLogs.js";
import type * as projects from "../projects.js";
import type * as sharedPreviews from "../sharedPreviews.js";
import type * as siteSpecs from "../siteSpecs.js";
import type * as testCases from "../testCases.js";
import type * as users from "../users.js";
import type * as vlmEvaluations from "../vlmEvaluations.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "ai/designChat": typeof ai_designChat;
  "ai/evaluateScreenshot": typeof ai_evaluateScreenshot;
  "ai/generateQuestions": typeof ai_generateQuestions;
  "ai/generateSiteSpec": typeof ai_generateSiteSpec;
  "ai/imageSearch": typeof ai_imageSearch;
  domains: typeof domains;
  feedback: typeof feedback;
  http: typeof http;
  imageCache: typeof imageCache;
  intakeResponses: typeof intakeResponses;
  pipelineLogs: typeof pipelineLogs;
  projects: typeof projects;
  sharedPreviews: typeof sharedPreviews;
  siteSpecs: typeof siteSpecs;
  testCases: typeof testCases;
  users: typeof users;
  vlmEvaluations: typeof vlmEvaluations;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
