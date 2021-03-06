import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { addLastFour } from '../store';
import ArrowUp from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-downward';
import SubmitBracket from './SubmitBracket';
import BuildHelp from './BuildHelp'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { white, black } from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';

class Build extends Component {

    constructor() {
        super();
        this.state = {
            teams: {},
            field: [],
            submitField: [],
            lastFour: [],
            bubblePop: [],
            submitted: false,
            blind: false,
            displayAdvanced: false
        }
    }

    componentDidMount() {
        this.combineRPIandBPI()
    }

    combineRPIandBPI() {
        const bpi = this.props.espnBPI;
        const nolan = this.props.nolan;
        const kpi = this.props.kpi;
        const confChamps = this.props.confChamps;

        // for (let conf in confChamps) {
        //     for (let i = 0; i < bpi.length; i++) {
        //         let teamObj = bpi[i];
        //         if (confChamps[conf] === teamObj.team) {
        //             teamObj.isChamp = true;
        //         }
        //     }
        // }

        for (let j = 0; j < bpi.length; j++) {
            let bpiObj = bpi[j];
            for (let i = 0; i < nolan.length; i++) {
                let nolanObj = nolan[i];
                if (bpiObj.team === nolanObj.team && !nolanObj.bpi) {
                    nolanObj = Object.assign(nolanObj, bpiObj)
                }
            }
        }

        for (let j = 0; j < kpi.length; j++) {
            let kpiObj = kpi[j];
            for (let i = 0; i < nolan.length; i++) {
                let nolanObj = nolan[i];
                if (kpiObj.team === nolanObj.team && !nolanObj.kpi) {
                    nolanObj = Object.assign(nolanObj, kpiObj)
                }
            }
        }


        const teams = nolan.map(teamObj => {
            if ((teamObj.rpi && teamObj.rpi < 86) || teamObj.isChamp === true) {
                return teamObj
            }
        })

        const field = teams.filter(team => {
            return team !== undefined
        })

        this.setState({ teams: nolan, field });

    }

    toggleMetricView() {
        this.setState({displayAdvanced: !this.state.displayAdvanced})
    }

    populateTeamCards() {

        const field = this.state.field;
        console.log(field)

        let metrics = '';

        this.state.displayAdvanced ? metrics = 'Traditional Stats' : metrics = 'Advanced Metrics'

        return field.map((teamObj, idx) => {
            return (
                <div key={idx} className='team-card'>
                    {
                        !this.state.blind
                            ?
                            <div>
                            <h3 className="team-card-name">{idx + 1 + '. ' + teamObj.team}</h3>
                            {
                                teamObj.isChamp === true
                                    ?
                                    <h5 className="team-card-small-header">{teamObj.conf} <small>Proj. Champ</small></h5>
                                    :
                                    <h5 className="team-card-small-header">{teamObj.conf}</h5>
                            }
                            </div>
                            :
                            <h3>No. {idx + 1}</h3>
                    }
                    {
                        this.state.displayAdvanced
                            ?
                            <div>
                                <RaisedButton label={`${metrics}`} onClick={this.toggleMetricView.bind(this)} />
                                <p>BPI: {teamObj.bpi}</p>
                                <p>BPI SOS: {teamObj.sos}</p>
                                <p>BPI SOR: {teamObj.sor}</p>
                                <p>KPI: {teamObj.kpi}</p>
                                <p>KPI SOS: {teamObj.kpiSOS}</p>
                                <p>vs. KPI Top 50: {teamObj.top50}</p>
                            </div>
                            :
                            <div>
                                <RaisedButton label={`${metrics}`} onClick={this.toggleMetricView.bind(this)} />
                                <p>Record: {teamObj.record}</p>
                                <p>Home: {teamObj.home}</p>
                                <p>Away/Neutral: {teamObj.awayNeutral}</p>
                                <p>RPI: {teamObj.rpi}</p>
                                <p>vs. Group 1: {teamObj.group1}</p>
                                <p>vs. Group 2: {teamObj.group2}</p>
                                <p>vs. Group 3: {teamObj.group3}</p>
                                <p>vs. Group 4: {teamObj.group4}</p>
                            </div>

                    }
                    {
                        idx > 0
                            ?
                            <ArrowUp onClick={this.moveTeam.bind(this, idx, true)} />
                            :
                            null
                    }
                    {
                        idx < field.length - 1
                            ?
                            <ArrowDown onClick={this.moveTeam.bind(this, idx, false)} />
                            :
                            null
                    }
                    <div className="quick-rank">
                        <SelectField
                            floatingLabelText="Quick-Rank"
                            floatingLabelStyle={{ textColor: black }}
                            style={{width: 120, textColor: white }}
                        >
                            {
                                this.state.field.map((rank, selectIdx) => {
                                    return <MenuItem key={selectIdx} value={selectIdx} primaryText={selectIdx + 1} onClick={this.quickRank.bind(this, teamObj, selectIdx)} />
                                })
                            }

                        </SelectField>
                    </div>
                </div>
            )
        })
    }

    quickRank(teamObj, selectIdx) {
        let teams = this.state.field;
        let oldIdx = teams.indexOf(teamObj);
        let newIdx = selectIdx;
        if (oldIdx > newIdx) {
            teams.splice(newIdx, 0, teamObj)
            teams.splice(oldIdx + 1, 1)
        } else if (newIdx > oldIdx) {
            teams.splice(newIdx + 1, 0, teamObj)
            teams.splice(oldIdx, 1)
        }
        this.setState({ field: teams });
    }

    moveTeam(idx, bool) {
        let teams = this.state.field;
        let focus = teams[idx];
        let moveDown = teams[idx - 1];
        let moveUp = teams[idx + 1];
        let tempA = focus;
        let tempB = moveDown;
        let tempC = moveUp;

        if (bool) {
            teams[idx] = moveDown;
            teams[idx - 1] = tempA;
        } else {
            teams[idx] = tempC;
            teams[idx + 1] = focus;
        }

        this.setState({ field: teams })
    }


    toggleBlind() {
        this.setState({ blind: !this.state.blind })
    }

    render() {
        return (
            <div id="build-page">
                <div id="blind-button">
                {
                    this.state.blind
                        ?
                        <RaisedButton label="Leave Blind Mode" onClick={this.toggleBlind.bind(this)} />
                        :
                        <RaisedButton label="Go Blind" onClick={this.toggleBlind.bind(this)} />
                }
                </div>
                <div id="build-buttons">
                    <div id="submit-bracket">
                        <SubmitBracket field={this.state.field} id={this.props.id} />
                    </div>
                    <BuildHelp />
                </div>
                <div id='field'>
                    {
                        this.populateTeamCards.call(this)
                    }
                </div>
            </div>
        )
    }
}

const mapState = (state) => {
    return {
        espnRPI: state.espnRPI,
        espnBPI: state.espnBPI,
        kpi: state.kpi,
        nolan: state.nolan,
        confChamps: state.confChamps,
        userId: !!state.activeUser.id,
        id: state.activeUser.id
    }
}

export default withRouter(connect(mapState)(Build));
