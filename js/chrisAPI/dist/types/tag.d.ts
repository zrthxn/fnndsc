/**
 * Tag item resource object representing a feed tag.
 */
export class Tag extends ItemResource {
    /**
     * Fetch a list of feeds that are tagged with this tag from the REST API.
     *
     * @param {Object} [params=null] - page parameters object
     * @param {number} [params.limit] - page limit
     * @param {number} [params.offset] - page offset
     * @param {number} [timeout=30000] - request timeout
     *
     * @return {Object} - JS Promise, resolves to a ``TagFeedList`` object
     */
    getTaggedFeeds(params?: {
        limit?: number;
        offset?: number;
    }, timeout?: number): any;
    /**
     * Fetch a list of taggings made with this tag from the REST API.
     *
     * @param {Object} [params=null] - page parameters object
     * @param {number} [params.limit] - page limit
     * @param {number} [params.offset] - page offset
     * @param {number} [timeout=30000] - request timeout
     *
     * @return {Object} - JS Promise, resolves to a ``TaggingList`` object
     */
    getTaggings(params?: {
        limit?: number;
        offset?: number;
    }, timeout?: number): any;
    /**
     * Make a PUT request to modify this tag item resource through the REST API.
     *
     * @param {Object} data - request JSON data object
     * @param {string} [data.name] - tag name
     * @param {string} [data.color] - tag color
     * @param {number} [timeout=30000] - request timeout
     *
     * @return {Object} - JS Promise, resolves to ``this`` object
     */
    put(data: {
        name?: string;
        color?: string;
    }, timeout?: number): any;
    /**
     * Make a DELETE request to delete this tag item resource through the REST API.
     *
     * @param {number} [timeout=30000] - request timeout
     *
     * @return {Object} - JS Promise
     */
    delete(timeout?: number): any;
}
/**
 * Tag list resource object representing a list of a feed's tags.
 */
export class TagList extends ListResource {
    /**
     * Fetch a list of feeds from the REST API.
     *
     * @param {Object} [searchParams=null] - search parameters object which is
     * resource-specific, the ``FeedList.getSearchParameters`` method can be
     * used to get a list of possible search parameters
     * @param {number} [searchParams.limit] - page limit
     * @param {number} [searchParams.offset] - page offset
     * @param {number} [timeout=30000] - request timeout
     *
     * @return {Object} - JS Promise, resolves to a ``FeedList`` object
     */
    getFeeds(searchParams?: {
        limit?: number;
        offset?: number;
    }, timeout?: number): any;
    /**
     * Make a POST request to this tag list resource to create a new tag item resource
     * through the REST API.
     *
     * @param {Object} data - request JSON data object
     * @param {string} [data.name] - tag name
     * @param {string} [data.color] - tag color
     * @param {number} [timeout=30000] - request timeout
     *
     * @return {Object} - JS Promise, resolves to ``this`` object
     */
    post(data: {
        name?: string;
        color?: string;
    }, timeout?: number): any;
}
/**
 * Tagging item resource object representing a tagging of an specific feed with an
 * specific tag.
 */
export class Tagging extends ItemResource {
    /**
     * Fetch the tag associated to this tagging from the REST API.
     *
     * @param {number} [timeout=30000] - request timeout
     *
     * @return {Object} - JS Promise, resolves to a ``Tag`` object
     */
    getTag(timeout?: number): any;
    /**
     * Fetch the feed associated to this tagging from the REST API.
     *
     * @param {number} [timeout=30000] - request timeout
     *
     * @return {Object} - JS Promise, resolves to a ``Feed`` object
     */
    getFeed(timeout?: number): any;
    /**
     * Make a DELETE request to delete this tagging item resource through the REST API.
     *
     * @param {number} [timeout=30000] - request timeout
     *
     * @return {Object} - JS Promise
     */
    delete(timeout?: number): any;
}
/**
 * Tag-specific tagging list resource object representing a list of taggings made with an
 * specific tag.
 */
export class TagTaggingList extends ListResource {
    /**
     * Fetch the tag associated to this tag-specific list of taggings from the REST API.
     *
     * @param {number} [timeout=30000] - request timeout
     *
     * @return {Object} - JS Promise, resolves to a ``Tag`` object
     */
    getTag(timeout?: number): any;
    /**
     * Make a POST request to this tag-specific tagging list resource to create a new
     * tagging item resource through the REST API.
     *
     * @param {Object} data - request JSON data object
     * @param {string} data.feed_id - id of the feed to be tagged
     * @param {number} [timeout=30000] - request timeout
     *
     * @return {Object} - JS Promise, resolves to ``this`` object
     */
    post(data: {
        feed_id: string;
    }, timeout?: number): any;
}
/**
 * Feed-specific tagging list resource object representing a list of taggings applied to
 * an specific feed.
 */
export class FeedTaggingList extends ListResource {
    /**
     * Fetch the feed associated to this feed-specific list of taggings from the REST API.
     *
     * @param {number} [timeout=30000] - request timeout
     *
     * @return {Object} - JS Promise, resolves to a ``Feed`` object
     */
    getFeed(timeout?: number): any;
    /**
     * Make a POST request to this feed-specific tagging list resource to create a new
     * tagging item resource through the REST API.
     *
     * @param {Object} data - request JSON data object
     * @param {string} data.tag_id - id of the tag to be used to tag the feed
     * @param {number} [timeout=30000] - request timeout
     *
     * @return {Object} - JS Promise, resolves to ``this`` object
     */
    post(data: {
        tag_id: string;
    }, timeout?: number): any;
}
/**
 * Tag-specific feed list resource object representing a list of feeds that are tagged
 * with an specific tag.
 */
export class TagFeedList extends ListResource {
    /**
     * Fetch the tag associated to this tag-specific list of feeds from the REST API.
     *
     * @param {number} [timeout=30000] - request timeout
     *
     * @return {Object} - JS Promise, resolves to a ``Tag`` object
     */
    getTag(timeout?: number): any;
}
/**
 * Feed-specific tag list resource object representing a list of tags that an specific
 * feed is tagged with.
 */
export class FeedTagList extends ListResource {
    /**
     * Fetch the feed associated to this feed-specific list of tags from the REST API.
     *
     * @param {number} [timeout=30000] - request timeout
     *
     * @return {Object} - JS Promise, resolves to a ``Feed`` object
     */
    getFeed(timeout?: number): any;
}
import { ItemResource } from "./resource";
import { ListResource } from "./resource";
