import React from "react";
import set from "lodash/fp/set";
import { Field } from "redux-form";
import Table from "react-table";
import * as BS from "react-bootstrap";
import {data} from "./dataFactory";
import FormProvider from "./FormProvider";
import ActionsCell from "./ActionsCell";
import HighlightCell from "./HighlightCell";
import GridFilters from "./GridFilters";

 class App extends React.Component {
  state = { data:data, editing: null,searchInput: "" };


  handleChange = event => {
    this.setState({ searchInput: event.target.value }, () => {
      this.globalSearch();
    });
  };
  globalSearch = () => {
    let { searchInput } = this.state;
    let filteredData = data.filter(value => {
      return (
        value.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.code.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.id
          .toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
          value.city
          .toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
          value.space_available
          .toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
          value.type
          .toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
          value.cluster
          .toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
          value.is_live
          .toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase()) 
      );
    });
    this.setState({ data: filteredData });
  };

  editableComponent = ({ input, editing, value, ...rest }) => {
    const Component = editing ? BS.FormControl : BS.FormControl.Static;
    const children =
      (!editing && <HighlightCell value={value} {...rest} />) || undefined;
    return <Component {...input} {...rest} children={children} />;
  };

  editableColumnProps = {
    ...GridFilters,
    Cell: props => {
      const editing = this.state.editing === props.original;
      const fieldProps = {
        component: this.editableComponent,
        editing,
        props
      };

      return <Field name={props.column.id} {...fieldProps} />;
    }
  };

  getActionProps = (gridState, rowProps) =>
    (rowProps && {
      mode: this.state.editing === rowProps.original ? "edit" : "view",
      actions: {
        onEdit: () => this.setState({ editing: rowProps.original }),
        onCancel: () => this.setState({ editing: null })
      }
    }) ||
    {};

  columns = [
    {
      Header: "",
      maxWidth: 90,
      filterable: false,
      getProps: this.getActionProps,
      Cell: ActionsCell
    },
    
    { Header: "Name", accessor: "name", ...this.editableColumnProps },
    { Header: "Code", accessor: "code",},
    { Header: "Id", accessor: "id" },
    { Header: "City", accessor: "city", ...this.editableColumnProps},
    { Header: "Space", accessor: "space_available", ...this.editableColumnProps},
    { Header: "Type", accessor: "type",},
    { Header: "Cluster", accessor: "cluster", ...this.editableColumnProps},
    { Header: "Registered",id:"registered", accessor: d => d.is_registered.toString() },
    { Header: "Live",id:"live", accessor:d => d.is_live.toString() , ...this.editableColumnProps},

  ];

  handleSubmit = values => {
    this.setState(state => {
      const index = this.state.data.indexOf(this.state.editing);
      return {
        data: set(`[${index}]`, values, state.data)
      };
    });
  };

  render() {
    return (
      <div className="container mt-3 mb-3">
                    
          <h2 className="center-text offset-4 mt-3 mb-3">
            Warehouse Datatable
          </h2>
          <label htmlFor='global-search'>Global Search</label>
          <input 
          id="global-search"
          className="form-control"
          placeholder='Enter ...'
          type='search' 
          name='global-search'
          value={this.state.searchInput || ""}
          onChange={this.handleChange}/>
          <FormProvider
            form="inline"
            onSubmit={this.handleSubmit}
            onSubmitSuccess={() => this.setState({ editing: null })}
            initialValues={this.state.editing}
            enableReinitialize
          >
            {formProps => {
              return (
                <form onSubmit={formProps.handleSubmit}>
                  <Table className="mt-4"
                    columns={this.columns}
                    data={this.state.data}
                    defaultPageSize={5}
                  />
                </form>
              );
            }}
          </FormProvider>
        
       </div>
    );
  }
}
export default App;
