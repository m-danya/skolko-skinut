import React, { Component } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'

export default class MoreInfo extends Component {
    state = { activeIndex: 0 } // CHANGE TO -1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    componentDidMount() {
        let sum = 0;
        for (let name in this.props.expenses) {
            sum += this.props.expenses[name];
        }
        this.setState({
            sum: sum,
        });
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    render() {
        const { activeIndex } = this.state;
        return (
            <Accordion 
            styled = {this.state.activeIndex >= 0}
            >
                <Accordion.Title
                    active={activeIndex === 0}
                    index={0}
                    onClick={this.handleClick}
                >
                    <Icon name='dropdown' />
                    <text className='moreDetails'>
                        Больше информации
                    </text>
                    <br />
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    <p className='centerText tableHeaderFont'>

                        Всего потрачено денег: {this.state.sum} ₽
                    </p>
                    <p className='centerText tableHeaderFont'>

                        Траты каждого участника:
                    </p>

                    <p>
                        {this.props.namesArray.map((name) => {
                            return (
                                <p className='centerText tableHeaderFont'>
                                    {name}: {this.props.expenses[name]} ₽
                                </p>
                            )
                        })
                        }

                    </p>
                </Accordion.Content>
            </Accordion>
        )
    }
}
