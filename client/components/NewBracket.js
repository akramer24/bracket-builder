import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '../store';
import createSeedlines from '../../utils/createSeedlines';

class NewBracket extends Component {

    componentDidMount() {
        this.render();
    }

    render() {

        if (this.props.newBracket && this.props.newLastFour) {
        
        const seedLines = createSeedlines(this.props.newBracket, this.props.newLastFour);
            return (
                <div>
                {
                    seedLines.map((line, idx) => {
                        return (
                            <div key={idx}>
                                <h5>No. {idx + 1} seeds</h5>
                                {
                                    line.map(team => {
                                       return (
                                           <p key={team} className="new-bracket-team">{team}</p>
                                       )
                                   })
                                }
                            </div>
                        )
                    })
                }
                </div>

            )
        } else {
            return null;
        }
    }
}

const mapState = (state) => {
    return {
        newBracket: state.currentUserBrackets[state.currentUserBrackets.length - 1],
        newLastFour: state.userLastFours[state.userLastFours.length - 1]
    }
}


export default withRouter(connect(mapState)(NewBracket));