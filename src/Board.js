import React from "react";
// import dragula from "dragula";
import "dragula/dist/dragula.css";
import Swimlane from "./Swimlane";
import "./Board.css";
import Dragula from "dragula";
import { swimlanesData } from "./swimlanes.data";
export default class Board extends React.Component {
  constructor(props) {
    super(props);
    let clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.filter(
          (client) => !client.status || client.status === "backlog"
        ),
        inProgress: clients.filter(
          (client) => client.status && client.status === "in-progress"
        ),
        complete: clients.filter(
          (client) => client.status && client.status === "complete"
        ),
      },
      data: clients,
    };
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };
  }
  getClients() {
    return swimlanesData.map((companyDetails) => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  componentDidMount() {
    const drake = Dragula([
      this.swimlanes.complete.current,
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
    ]);
    // listening for the drop event and using the following data to change status of card
    drake.on("drop", (el, target, source, sibling) => {
      const elId = el.dataset.id;
      const siblingStatus = sibling && sibling.dataset.status;
      let swimlanesHeader = target.parentNode.childNodes[0].innerText;

      // find the element id and changing its status to that of the target
      let droppedData = this.state.data.find(
        (client) => client.id === elId.toString()
      );
      if (sibling === null) {
        if (swimlanesHeader === "In Progress") {
          swimlanesHeader = swimlanesHeader.replace(
            swimlanesHeader,
            "in-progress"
          );
          droppedData.status = swimlanesHeader;
        }
        droppedData.status = swimlanesHeader.toLowerCase();
      } else {
        droppedData.status = siblingStatus;
      }

      this.setState({
        data: [...this.state.data, droppedData],
      });
    });
  }

  renderSwimlane(name, clients, ref) {
    return <Swimlane name={name} clients={clients} dragulaRef={ref} />;
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane(
                "Backlog",
                this.state.clients.backlog,
                this.swimlanes.backlog
              )}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane(
                "In Progress",
                this.state.clients.inProgress,
                this.swimlanes.inProgress
              )}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane(
                "Complete",
                this.state.clients.complete,
                this.swimlanes.complete
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
