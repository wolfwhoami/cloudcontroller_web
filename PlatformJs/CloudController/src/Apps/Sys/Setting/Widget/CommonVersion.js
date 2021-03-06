/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.Setting.Widget.CommonVersion", {
   extend: "WebOs.Kernel.ProcessModel.AbstractWidget",
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT("COMMON_VERSION");
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("COMMON_VERSION");
   },
   versionGrid: null,
   /**
    * @template
    * @inheritdoc
    */
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         width: 600,
         minWidth: 600,
         minHeight: 300,
         height: 300,
         resizable: false,
         layout: "fit",
         maximizable: false
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         items: [
            this.getVersionGridConfig()
         ]
      });
      this.callParent();
   },
   getVersionGridConfig: function()
   {
      var COLS = this.LANG_TEXT.COLS;
      var NAMES = this.GET_LANG_TEXT("SYS_NAMES");
      var QUERY_TEXT = this.LANG_TEXT.MSG.QUERY;
      return {
         xtype: "grid",
         columns: [
            {text: COLS.NAME, dataIndex: "name", flex: 1, resizable: false, menuDisabled: true},
            {text: COLS.VERSION, dataIndex: "version", width: 200, resizable: false, menuDisabled: true}
         ],
         autoScroll: true,
         store: new Ext.data.Store({
            fields: [
               {name: "name", type: "string"},
               {name: "version", type: "string"},
               {name: "key", type: "string"}
            ],
            data: [
               {name: NAMES.CLOUD_CONTROLLER, version: QUERY_TEXT, key: "CloudController"},
               {name: NAMES.META_SERVER, version: QUERY_TEXT, key: "MetaServer"},
               {name: NAMES.UPGRADEMGR_MASTER, version: QUERY_TEXT, key: "UpgrademgrMaster"}
            ]
         }),
         listeners: {
            afterrender: function(grid)
            {
               this.versionGrid = grid;
               this.appRef.getCloudControllerVersion(function(response){
                  var version;
                  if(response.status){
                     version = response.data.version;
                  }else{
                     version = response.msg;
                  }
                  var record = grid.store.findRecord("key", "CloudController");
                  record.set("version", version);
               }, this);
               this.appRef.getUpgrademgrVersion(function(response){
                  var version;
                  if(response.status){
                     version = response.getDataItem("version");
                  }else{
                     version = response.getErrorString();
                  }
                  var record = grid.store.findRecord("key", "UpgrademgrMaster");
                  record.set("version", version);
               }, this);
               this.appRef.getMetaServerVersion(function(response){
                  var version;
                  if(response.status){
                     version = response.getDataItem("version");
                  }else{
                     version = response.getErrorString();
                  }
                  var record = grid.store.findRecord("key", "MetaServer");
                  record.set("version", version);
               }, this);

            },
            scope: this
         }
      };
   },
   destroy: function()
   {
      delete this.versionGrid;
      this.callParent();
   }
});