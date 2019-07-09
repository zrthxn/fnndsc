/** * Imports ***/
import Collection from './cj';
import Request from './request';
import RequestException from './exception';
import { FeedList } from './feed';
import { AllFeedFileList } from './feedfile';
import { PluginList } from './plugin';
import { AllPluginInstanceList, PluginInstanceList } from './plugininstance';
import { AllPipelineInstanceList, PipelineInstanceList } from './pipelineinstance';
import { PipelineList } from './pipeline';
import { TagList } from './tag';
import { UploadedFileList } from './uploadedfile';
import User from './user';

/**
 * API client object.
 */
export default class Client {
  /**
   * Constructor
   *
   * @param {string} url - url of the ChRIS service
   * @param {Object} auth - authentication object
   * @param {string} auth.token - authentication token
   */
  constructor(url, auth) {
    /** @type {string} */
    this.url = url;

    if (!auth) {
      throw new RequestException('Authentication object is required');
    }
    /** @type {Object} */
    this.auth = auth;

    /* Urls of the high level API resources */
    this.feedsUrl = this.url;
    this.filesUrl = '';
    this.pluginsUrl = '';
    this.pluginInstancesUrl = '';
    this.pipelinesUrl = '';
    this.pipelineInstancesUrl = '';
    this.tagsUrl = '';
    this.uploadedFilesUrl = '';
    this.userUrl = '';
  }

  /**
   * Set the urls of the high level API resources.
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise
   */
  setUrls(timeout = 30000) {
    return this.getFeeds(timeout);
  }

  /**
   * Get a paginated list of currently authenticated user's feeds
   * from the REST API given query search parameters. If no search parameters
   * then get the default first page.
   *
   * @param {Object} [searchParams=null] - search parameters object
   * @param {number} [searchParams.limit] - page limit
   * @param {number} [searchParams.offset] - page offset
   * @param {number} [searchParams.id] - match feed id exactly with this number
   * @param {number} [searchParams.min_id] - match feed id gte this number
   * @param {number} [searchParams.max_id] - match feed id lte this number
   * @param {string} [searchParams.name] - match feed name containing this string
   * @param {number} [searchParams.min_creation_date] - match feed creation date gte this date
   * @param {number} [searchParams.max_creation_date] - match feed creation date lte this date
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``FeedList`` object
   */
  getFeeds(searchParams = null, timeout = 30000) {
    const feedList = new FeedList(this.feedsUrl, this.auth);

    return feedList.get(searchParams, timeout).then(feedList => {
      const coll = feedList.collection;
      const getUrl = Collection.getLinkRelationUrls;

      this.filesUrl = this.filesUrl || getUrl(coll, 'files');
      this.pluginsUrl = this.pluginsUrl || getUrl(coll, 'plugins');
      this.pluginInstancesUrl = this.pluginInstancesUrl || getUrl(coll, 'plugin_instances');
      this.pipelinesUrl = this.pipelinesUrl || getUrl(coll, 'pipelines');
      this.pipelineInstancesUrl = this.pipelineInstancesUrl || getUrl(coll, 'pipeline_instances');
      this.tagsUrl = this.tagsUrl || getUrl(coll, 'tags');
      this.uploadedFilesUrl = this.uploadedFilesUrl || getUrl(coll, 'uploadedfiles');
      this.userUrl = this.userUrl || getUrl(coll, 'user');

      return feedList;
    });
  }

  /**
   * Get a feed resource object given its id.
   *
   * @param {number} id - feed id
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``Feed`` object
   */
  getFeed(id, timeout = 30000) {
    return this.getFeeds({ id: id }, timeout).then(listRes => listRes.getItem(id));
  }

  /**
   * Tag a feed given its id and the id of the tag.
   *
   * @param {number} feed_id - feed id
   * @param {number} tag_id - tag id
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``Tagging`` object
   */
  tagFeed(feed_id, tag_id, timeout = 30000) {
    return this.getFeed(feed_id, timeout)
      .then(feed => feed.getTaggings(timeout))
      .then(listRes => listRes.post({ tag_id: tag_id }), timeout)
      .then(listRes => listRes.getItems()[0]);
  }

  /**
   * Get a paginated list of files written to any user-owned feed from the REST
   * API given query search parameters. If no search parameters then get the
   * default first page.
   *
   * @param {Object} [searchParams=null] - search parameters object
   * @param {number} [searchParams.limit] - page limit
   * @param {number} [searchParams.offset] - page offset
   * @param {number} [searchParams.id] - match file id exactly with this number
   * @param {number} [searchParams.plugin_inst_id] - match the associated plugin instance
   * id exactly with this number
   * @param {number} [searchParams.feed_id] - match the associated feed id exactly with this number
   * @param {string} [searchParams.min_creation_date] - match file creation date gte this date
   * @param {string} [searchParams.max_creation_date] - match file creation date lte this date
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``AllFeedFileList`` object
   */
  getFiles(searchParams = null, timeout = 30000) {
    return this._fetchRes(this.filesUrl, AllFeedFileList, searchParams, timeout);
  }

  /**
   * Get a file resource object given its id.
   *
   * @param {number} id - file id
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``FeedFile`` object
   */
  getFile(id, timeout = 30000) {
    return this.getFiles({ id: id }, timeout).then(listRes => listRes.getItem(id));
  }

  /**
   * Get a paginated list of plugins from the REST API given query search
   * parameters. If no search parameters then get the default first page.
   *
   * @param {Object} [searchParams=null] - search parameters object
   * @param {number} [searchParams.limit] - page limit
   * @param {number} [searchParams.offset] - page offset
   * @param {number} [searchParams.id] - match plugin id exactly with this number
   * @param {string} [searchParams.name] - match plugin name containing this string
   * @param {string} [searchParams.name_exact] - match plugin name exactly with this string
   * @param {string} [searchParams.version] - match plugin version exactly with this string
   * @param {string} [searchParams.dock_image] - match plugin docker image exactly with this string
   * @param {string} [searchParams.type] - match plugin type exactly with this string
   * @param {string} [searchParams.category] - match plugin category containing this string
   * @param {string} [searchParams.description] - match plugin description containing this string
   * @param {string} [searchParams.title] - match plugin title containing this string
   * @param {string} [searchParams.authors] - match plugin authors containing this string
   * @param {string} [searchParams.min_creation_date] - match plugin creation date gte this date
   * @param {string} [searchParams.max_creation_date] - match plugin creation date lte this date
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``PluginList`` object
   */
  getPlugins(searchParams = null, timeout = 30000) {
    return this._fetchRes(this.pluginsUrl, PluginList, searchParams, timeout);
  }

  /**
   * Get a plugin resource object given its id.
   *
   * @param {number} id - plugin id
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``Plugin`` object
   */
  getPlugin(id, timeout = 30000) {
    return this.getPlugins({ id: id }, timeout).then(listRes => listRes.getItem(id));
  }

  /**
   * Get a paginated list of plugin instances from the REST API given query search
   * parameters. If no search parameters then get the default first page.
   *
   * @param {Object} [searchParams=null] - search parameters object
   * @param {number} [searchParams.limit] - page limit
   * @param {number} [searchParams.offset] - page offset
   * @param {number} [searchParams.id] - match plugin instance id exactly with this number
   * @param {string} [searchParams.title] - match plugin instance title containing this string
   * @param {string} [searchParams.status] - match plugin instance execution status exactly with this string
   * @param {string} [searchParams.owner_username] - match plugin instances's owner username exactly with this string
   * @param {number} [searchParams.feed_id] - match associated feed's id exactly with this number
   * @param {number} [searchParams.root_id] - match root plugin instance's id exactly with this number
   * @param {number} [searchParams.plugin_id] - match associated plugin's id exactly with this number
   * @param {number} [searchParams.plugin_name] - match associated plugin's name containing this string
   * @param {number} [searchParams.plugin_name_exact] - match associated plugin's name exact with this string
   * @param {number} [searchParams.plugin_version] - match associated plugin's verion exactly with this string
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to ``AllPluginInstanceList`` object
   */
  getPluginInstances(searchParams = null, timeout = 30000) {
    return this._fetchRes(this.pluginInstancesUrl, AllPluginInstanceList, searchParams, timeout);
  }

  /**
   * Get a plugin instance resource object given its id.
   *
   * @param {number} id - plugin instance id
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``PluginInstance`` object
   */
  getPluginInstance(id, timeout = 30000) {
    return this.getPluginInstances({ id: id }, timeout).then(listRes => listRes.getItem(id));
  }

  /**
   * Create a new plugin instance resource through the REST API.
   *
   * @param {number} pluginId - plugin id
   * @param {Object} data - request data object which is plugin-specific
   * @param {number} data.previous_id=null - id of the previous plugin instance
   * @param {string} [data.title] - title
   * @param {string} [data.cpu_limit] - cpu limit
   * @param {string} [data.memory_limit] - memory limit
   * @param {string} [data.number_of_workers] - number of workers
   * @param {string} [data.gpu_limit] - gpu limit
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to ``PluginInstance`` object
   */
  createPluginInstance(pluginId, data, timeout = 30000) {
    return this.getPlugin(pluginId, timeout)
      .then(plg => {
        const instancesUrl = Collection.getLinkRelationUrls(plg.collection.items[0], 'instances');
        const plgInstList = new PluginInstanceList(instancesUrl[0], this.auth);
        return plgInstList.post(data, timeout);
      })
      .then(plgInstList => plgInstList.getItems()[0]);
  }

  /**
   * Get a paginated list of pipelines from the REST API given query search
   * parameters. If no search parameters then get the default first page.
   *
   * @param {Object} [searchParams=null] - search parameters object
   * @param {number} [searchParams.limit] - page limit
   * @param {number} [searchParams.offset] - page offset
   * @param {number} [searchParams.id] - match plugin id exactly with this number
   * @param {string} [searchParams.name] - match plugin name containing this string
   * @param {string} [searchParams.owner_username] - match pipeline's owner username exactly with this string
   * @param {string} [searchParams.category] - match plugin category containing this string
   * @param {string} [searchParams.description] - match plugin description containing this string
   * @param {string} [searchParams.authors] - match plugin authors containing this string
   * @param {string} [searchParams.min_creation_date] - match plugin creation date gte this date
   * @param {string} [searchParams.max_creation_date] - match plugin creation date lte this date
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``PipelineList`` object
   */
  getPipelines(searchParams = null, timeout = 30000) {
    return this._fetchRes(this.pipelinesUrl, PipelineList, searchParams, timeout);
  }

  /**
   * Get a pipeline resource object given its id.
   *
   * @param {number} id - pipeline id
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``Pipeline`` object
   */
  getPipeline(id, timeout = 30000) {
    return this.getPipelines({ id: id }, timeout).then(listRes => listRes.getItem(id));
  }

  /**
   * Create a new pipeline resource through the REST API.
   *
   * @param {Object} data - request data object
   * @param {string} data.name - pipeline name
   * @param {string} [data.authors] - pipeline authors
   * @param {string} [data.category] - pipeline category
   * @param {string} [data.description] - pipeline description
   * @param {boolean} [data.locked=true] - pipeline status
   * @param {string} [data.plugin_tree] - JSON string containing a plugin tree list
   * @param {number} [data.plugin_inst_id] - plugin instance id
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to ``Pipeline`` object
   */
  createPipeline(data, timeout = 30000) {
    const createRes = () => {
      const res = new PipelineList(this.pipelinesUrl, this.auth);
      return res.post(data, timeout).then(res => res.getItems()[0]);
    };
    return this.pipelinesUrl ? createRes() : this.setUrls().then(() => createRes());
  }

  /**
   * Get a paginated list of pipeline instances from the REST API given
   * query search parameters. If no search parameters then get the default
   * first page.
   *
   * @param {Object} [searchParams=null] - search parameters object
   * @param {number} [searchParams.limit] - page limit
   * @param {number} [searchParams.offset] - page offset
   * @param {number} [searchParams.id] - match pipeline instance id exactly with this number
   * @param {string} [searchParams.title] - match pipeline instance title containing this string
   * @param {string} [searchParams.description] - match pipeline instance description containing this string
   * @param {string} [searchParams.pipeline_name] - match associated pipeline name containing this string
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to ``AllPipelineInstanceList`` object
   */
  getPipelineInstances(searchParams = null, timeout = 30000) {
    return this._fetchRes(
      this.pipelineInstancesUrl,
      AllPipelineInstanceList,
      searchParams,
      timeout
    );
  }

  /**
   * Get a pipeline instance resource object given its id.
   *
   * @param {number} id - pipeline instance id
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``PipelineInstance`` object
   */
  getPipelineInstance(id, timeout = 30000) {
    return this.getPipelineInstances({ id: id }, timeout).then(listRes => listRes.getItem(id));
  }

  /**
   * Create a new pipeline instance resource through the REST API.
   *
   * @param {number} pipelineId - pipeline id
   * @param {Object} data - request data object which is pipeline-specific
   * @param {number} data.previous_plugin_inst_id - id of the previous plugin instance
   * @param {string} [data.title] - pipeline title
   * @param {string} [data.description] - pipeline description
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to ``PipelineInstance`` object
   */
  createPipelineInstance(pipelineId, data, timeout = 30000) {
    return this.getPipeline(pipelineId, timeout)
      .then(pipeline => {
        const instancesUrl = Collection.getLinkRelationUrls(
          pipeline.collection.items[0],
          'instances'
        );
        const pipInstList = new PipelineInstanceList(instancesUrl[0], this.auth);
        return pipInstList.post(data, timeout);
      })
      .then(pipInstList => pipInstList.getItems()[0]);
  }

  /**
   * Get a paginated list of tags from the REST API given query search
   * parameters. If no search parameters then get the default first page.
   *
   * @param {Object} [searchParams=null] - search parameters object
   * @param {number} [searchParams.limit] - page limit
   * @param {number} [searchParams.offset] - page offset
   * @param {number} [searchParams.id] - match tag id exactly with this number
   * @param {string} [searchParams.name] - match tag name containing this string
   * @param {string} [searchParams.owner_username] - match tag's owner username exactly with this string
   * @param {string} [searchParams.color] - match plugin color containing this string
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``TagList`` object
   */
  getTags(searchParams = null, timeout = 30000) {
    return this._fetchRes(this.tagsUrl, TagList, searchParams, timeout);
  }

  /**
   * Get a tag resource object given its id.
   *
   * @param {number} id - tag id
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``Tag`` object
   */
  getTag(id, timeout = 30000) {
    return this.getTags({ id: id }, timeout).then(listRes => listRes.getItem(id));
  }

  /**
   * Create a new tag resource through the REST API.
   *
   * @param {Object} data - request data object
   * @param {string} data.color - tag color
   * @param {string} [data.name=''] - tag name
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to ``Tag`` object
   */
  createTag(data, timeout = 30000) {
    const createRes = () => {
      const res = new TagList(this.tagsUrl, this.auth);
      return res.post(data, timeout).then(res => res.getItems()[0]);
    };
    return this.tagsUrl ? createRes() : this.setUrls().then(() => createRes());
  }

  /**
   * Get a paginated list of uploaded files from the REST API given query search
   * parameters. If no search parameters then get the default first page.
   *
   * @param {Object} [searchParams=null] - search parameters object
   * @param {number} [searchParams.limit] - page limit
   * @param {number} [searchParams.offset] - page offset
   * @param {number} [searchParams.id] - match file id exactly with this number
   * @param {string} [searchParams.upload_path] - match file's upload path containing this string
   * @param {string} [searchParams.owner_username] - match file's owner username exactly with this string
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``UploadedFileList`` object
   */
  getUploadedFiles(searchParams = null, timeout = 30000) {
    return this._fetchRes(this.uploadedFilesUrl, UploadedFileList, searchParams, timeout);
  }

  /**
   * Get an uploaded file resource object given its id.
   *
   * @param {number} id - uploaded file id
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to an ``UploadedFile`` object
   */
  getUploadedFile(id, timeout = 30000) {
    return this.getUploadedFiles({ id: id }, timeout).then(listRes => listRes.getItem(id));
  }

  /**
   * Upload a file and create a new uploaded file resource through the REST API.
   *
   * @param {Object} data - request data object
   * @param {string} data.upload_path - absolute path including file name where the file
   * will be uploaded on the storage service
   * @param {?Object} uploadFileObj - custom file object
   * @param {Object} uploadFileObj.fname - file blob
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to ``UploadedFile`` object
   */
  uploadFile(data, uploadFileObj, timeout = 30000) {
    const createRes = () => {
      const res = new UploadedFileList(this.uploadedFilesUrl, this.auth);
      return res.post(data, uploadFileObj, timeout).then(res => res.getItems()[0]);
    };
    return this.uploadedFilesUrl ? createRes() : this.setUrls().then(() => createRes());
  }

  /**
   * Get a user resource object for the currently authenticated user.
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``User`` object
   */
  getUser(timeout = 30000) {
    return this._fetchRes(this.userUrl, User, null, timeout);
  }

  /**
   * Create a new user account.
   *
   * @param {string} usersUrl - url of the user accounts service
   * @param {string} username - username
   * @param {string} password - password
   * @param {string} email - user email
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``User`` object
   */
  static createUser(usersUrl, username, password, email, timeout = 30000) {
    const req = new Request(undefined, 'application/vnd.collection+json', timeout);
    const userData = {
      template: {
        data: [
          { name: 'username', value: username },
          { name: 'password', value: password },
          { name: 'email', value: email },
        ],
      },
    };
    return req.post(usersUrl, userData).then(resp => {
      const coll = resp.data.collection;
      const userUrl = coll.items[0].href;
      const auth = { username: username, password: password };
      const user = new User(userUrl, auth);
      user.collection = coll;
      return user;
    });
  }

  /**
   * Fetch a user's login authorization token from the REST API.
   * @param {string} authUrl - url of the authorization service
   * @param {string} username - username
   * @param {string} password - password
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise, resolves to a ``string`` value
   */
  static getAuthToken(authUrl, username, password, timeout = 30000) {
    const req = new Request(undefined, 'application/json', timeout);
    const authData = {
      username: username,
      password: password,
    };
    return req.post(authUrl, authData).then(resp => resp.data.token);
  }

  /**
   * Helper method to run an asynchronous task defined by a task generator function.
   *
   * @param {function*()} taskGenerator - generator function
   */
  static runAsyncTask(taskGenerator) {
    Request.runAsyncTask(taskGenerator);
  }

  /**
   * Internal method to fetch a high level resource through the REST API.
   *
   * @param {string} resUrl -  url of the resource
   * @param {string} ResClass - resource class
   * @param {Object} [searchParams=null] - search parameters object
   * @param {number} [timeout=30000] - request timeout
   *
   * @return {Object} - JS Promise
   */
  _fetchRes(resUrl, ResClass, searchParams = null, timeout = 30000) {
    const getRes = () => {
      const res = new ResClass(resUrl, this.auth);
      return searchParams ? res.get(searchParams, timeout) : res.get(timeout);
    };
    return resUrl ? getRes() : this.setUrls().then(() => getRes());
  }
}
