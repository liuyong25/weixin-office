//模型 - issue
var Issue = Backbone.Model.extend({
  defaults: function() {
    return {
      "productName": "产品名称",
      "moduleName": "模块名称",
      "product": "产品ID",
      "module": "模块ID",
      "id": "需求ID",
      "title": "需求名称",
      "content": "需求描述",
      "status": "需求状态",
      "stage": "所处阶段"
    }
  }
});

//视图 - issue
var IssueView = Backbone.View.extend({
  tagName:  "li",

  attributes: {
    class: 'thumbnail issue'
    //,style:'position: relative;page-break-after: always;'
  },

  // Cache the template function for a single item.
  template: _.template(
    '<table class="table" style="width: 100%;height:100%;"> \
       <thead class="header"> \
         <tr> \
           <th style="border-right:1px solid #ccc;" class="header">Created: </th> \
           <th class="header">DeadLine: </th> \
           <th class="header" style="width:10px;"> \
            <button type="button" class="close noPrint">&times;</button> \
           </th> \
         </tr> \
       </thead> \
       <tbody> \
         <tr height="30px"> \
           <td colspan="3" style="WORD-BREAK: break-all; WORD-WRAP: break-word;"><strong>#<%=id%> <%=title%></strong></td> \
         </tr> \
         <tr> \
           <td colspan="3" style="WORD-BREAK: break-all; WORD-WRAP: break-word;"> \
            <%=content%> \
            <textarea rows="3" style="display:none;"><%=content%></textarea> \
           </td> \
         </tr> \
       </tbody> \
     </table>'
  ),

  //_.template($('#paramTpl').html()),

  //注册view事件
  events: {
    //"click button.close": "clear"
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'remove', this.remove);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  clear: function() {
    this.model.destroy();
  }
});

// The Application
// ---------------

// Our overall **AppView** is the top-level piece of UI.
var AppView = Backbone.View.extend({

  //整个APP VIEW的根DOM
  el: $("#apiApp"),

  //注册View事件
  events: {
    "click #btn-submit": "submit",
    "click #btn-print": "print"
  },

  //构造函数
  initialize: function(queryObj){
    var IssueCollection = Backbone.Collection.extend({model: Issue})
    this.issueList = new IssueCollection;
    this.$issueHolder = this.$("#issueHolder");
    this.excludeIds = [];
    this.originQueryObj = queryObj;

    //注册model事件
    this.listenTo(this.issueList, 'add', this.onAdd);
    this.listenTo(this.issueList, 'reset', this.onReset);
    this.listenTo(this.issueList, 'all', this.render);

    this.initProduct();
    $('.navbar').addClass('noPrint')
  },

  render: function(){
    return this;
  },

  //Model事件处理
  onAdd: function(model,collection,options){
    var view = new IssueView({model: model});
    this.$issueHolder.append(view.render().el);
    view.$('button.close').click($.proxy(function(e){
      this.issueList.remove(view.model);
      this.excludeIds.push(view.model.id)
      this.resetExcludeField();
      return false;
    },this));
  },

  onReset: function(collection,options){
    this.$issueHolder.empty();
    if(this.issueList.length>0){
      this.issueList.each(this.onAdd,this);
    }else{
      this.$issueHolder.html('未找到符合条件的数据');
    }
  },

  resetExcludeField: function(){
    this.$('#input-exclude-id').val(this.excludeIds.join(','))
  },

  //初始化产品下拉框
  initProduct: function(){
    $.ajax({
      url: '/issue/meta',
      context: this,
      success: function(data){
        var arkMap = _.chain(data.product)
          .filter(function(item){
            return item.name.indexOf('P-')!=-1
          }).map(function(item){
            return formatStr('<option value="{1}">{0}</option>',item.name,item.id)
          }).value();

        var elvisMap = _.chain(data.product)
          .filter(function(item){
            return item.name.indexOf('P-')==-1
          }).map(function(item){
            return formatStr('<option value="{1}">{0}</option>',item.name,item.id)
          }).value();

        var dom = formatStr(
          '<option value="">全部产品</option> \
            <optgroup label="产品类">{0} \
            </optgroup> \
            <optgroup label="项目类">{1} \
            </optgroup>'
          ,arkMap.join(''),elvisMap.join(''))

        this.$('#cb-product').html(dom)
        this.$('#cb-product').val(this.originQueryObj.productIds)
        this.$('#input-include-id').val(this.originQueryObj.includeIds)
        this.$('#input-exclude-id').val(this.originQueryObj.excludeIds)
        this.$('#cb-status').val(this.originQueryObj.status)
        this.$('#cb-stage').val(this.originQueryObj.stage)
      }
    });
  },

  //提交请求
  submit: function(e){
    var queryObj = {
      includeIds: this.$('#input-include-id').val(),
      excludeIds: this.$('#input-exclude-id').val(),
      productIds: this.$('#cb-product').val(),
      status: this.$('#cb-status').val(),
      stage: this.$('#cb-stage').val(),
      title: this.$('#input-include-title').val(),
    }
    //console.log(queryObj)

    $.ajax({
      url: '/issue/query',
      type: 'GET',
      context: this,
      data: {
        queryObj: queryObj
      },
      success: function(data){
        //console.log(data)
        this.issueList.reset(data.issues)
      }
    });
    return false;
  },

  print: function(e){
    window.print()
  }
});