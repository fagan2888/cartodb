module.exports = {
  getSchemaColumns: function (querySchemaModel, filterFunction) {
    if (!querySchemaModel) throw new Error('querySchemaModel is required');

    var columnsCollection = querySchemaModel.columnsCollection;
    if (filterFunction) {
      columnsCollection = columnsCollection.filter(filterFunction);
    }
    return columnsCollection.map(function (model) {
      var columnName = model.get('name');
      return {
        val: columnName,
        label: columnName,
        type: model.get('type')
      };
    });
  },

  getOptionsByStyleType: function (params) {
    if (!params.querySchemaModel) throw new Error('querySchemaModel is required');
    var optionsArray = this.getSchemaColumns(params.querySchemaModel, params.filterFunction);

    switch (params.styleType) {
      case 'heatmap':
        optionsArray = [{
          val: 'cartodb_id',
          label: 'cartodb_id',
          type: 'number'
        }];
        break;
      case 'regions':
        optionsArray = [{
          val: 'agg_value',
          label: 'agg_value',
          type: 'number'
        }, {
          val: 'agg_value_density',
          label: 'agg_value_density',
          type: 'number'
        }];
        break;
      case 'hexabins':
      case 'squares':
        optionsArray = [{
          val: 'agg_value',
          label: 'agg_value',
          type: 'number'
        }];
        break;
      case 'animation':
        if (params.animationType === 'heatmap') {
          optionsArray = [{
            val: 'cartodb_id',
            label: 'cartodb_id',
            type: 'number'
          }];
        }
        break;
      default:
        // Nothing
    }

    return optionsArray;
  },

  generateSelectByStyleType: function (params) {
    if (!params.componentName) throw new Error('componentName is required');
    if (!params.querySchemaModel) throw new Error('querySchemaModel is required');
    if (!params.styleType) throw new Error('styleType is required');

    var queryStatus = params.querySchemaModel.get('status');
    var isDisabled = queryStatus !== 'fetched';
    var helpMessage = _t('editor.style.components.' + params.componentName + '.' + queryStatus);

    return {
      type: 'Select',
      title: _t('editor.style.components.' + params.componentName + '.label'),
      placeholder: _t('editor.style.components.' + params.componentName + '.placeholder'),
      help: isDisabled ? helpMessage : '',
      options: this.getOptionsByStyleType({
        querySchemaModel: params.querySchemaModel,
        filterFunction: params.filterFunction,
        styleType: params.styleType
      }),
      dialogMode: 'float',
      validators: ['required'],
      editorAttrs: {
        disabled: isDisabled,
        help: _t('editor.style.components.animated-attribute.help')
      }
    };
  },

  generateSelectWithSchemaColumns: function (componentName, querySchemaModel, filterFunction) {
    var queryStatus = querySchemaModel.get('status');
    var isDisabled = queryStatus !== 'fetched';
    var helpMessage = _t('editor.style.components.' + componentName + '.' + queryStatus);

    return {
      type: 'Select',
      title: _t('editor.style.components.' + componentName + '.label'),
      help: isDisabled ? helpMessage : '',
      options: this.getSchemaColumns(querySchemaModel, filterFunction),
      dialogMode: 'float',
      validators: ['required'],
      editorAttrs: {
        disabled: isDisabled,
        help: _t('editor.style.components.animated-attribute.help')
      }
    };
  },

  generateSimpleStroke: function (params, type) {
    if (!params.querySchemaModel) throw new Error('querySchemaModel is required');
    if (!params.configModel) throw new Error('configModel is required');
    if (!params.styleType) throw new Error('styleType is required');
    if (!params.userModel) throw new Error('userModel is required');
    if (!params.modals) throw new Error('modals is required');

    var styleType = type === 'polygon' ? 'polygon' : params.styleType;

    return {
      type: 'Fill',
      title: _t('editor.style.components.stroke.label'),
      options: [],
      query: params.querySchemaModel.get('query'),
      configModel: params.configModel,
      userModel: params.userModel,
      modals: params.modals,
      dialogMode: 'float',
      editorAttrs: {
        size: {
          min: 0,
          max: 10,
          step: 0.5,
          hidePanes: ['value'],
          help: _t('editor.style.tooltips.stroke.size', {type: _t('editor.style.tooltips.' + styleType)})
        },
        color: {
          hidePanes: ['value'],
          help: _t('editor.style.tooltips.stroke.color', {type: _t('editor.style.tooltips.' + styleType)})
        }
      },
      validators: ['required']
    };
  },

  generateLineStroke: function (params) {
    if (!params.querySchemaModel) throw new Error('querySchemaModel is required');
    if (!params.configModel) throw new Error('configModel is required');
    if (!params.styleType) throw new Error('styleType is required');
    if (!params.userModel) throw new Error('userModel is required');
    if (!params.modals) throw new Error('modals is required');

    var queryStatus = params.querySchemaModel.get('status');
    var isDisabled = queryStatus !== 'fetched';
    var helpMessage = _t('editor.style.components.stroke.' + queryStatus);

    return {
      type: 'Fill',
      title: _t('editor.style.components.stroke.label'),
      help: isDisabled ? helpMessage : '',
      options: this.getOptionsByStyleType({
        querySchemaModel: params.querySchemaModel,
        styleType: params.styleType
      }),
      query: params.querySchemaModel.get('query'),
      configModel: params.configModel,
      userModel: params.userModel,
      modals: params.modals,
      dialogMode: 'float',
      editorAttrs: {
        min: 0,
        max: 50,
        disabled: isDisabled,
        size: {
          defaultRange: [1, 5],
          help: _t('editor.style.tooltips.stroke.size', {type: _t('editor.style.tooltips.line')})
        },
        color: {
          help: _t('editor.style.tooltips.stroke.color', {type: _t('editor.style.tooltips.line')})
        }
      },
      validators: ['required']
    };
  },

  hasGeometryOf: function (params, type) {
    return params.queryGeometryModel && params.queryGeometryModel.get('simple_geom') === type;
  }
};