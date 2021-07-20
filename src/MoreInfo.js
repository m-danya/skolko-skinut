import React, { Component } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'

export default class MoreInfo extends Component {
    state = { activeIndex: -1 }

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

        this.setState({ activeIndex: newIndex }, () => {
            window.scrollTo({
                top: document.body.scrollHeight,
                left: 0,
                behavior: 'smooth'
            });
        })

    }

    render() {
        const { activeIndex } = this.state;
        return (
            <Accordion
                styled={this.state.activeIndex >= 0}
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

                        <b>Всего потрачено денег:</b> {this.state.sum} ₽
                    </p>
                    <p className='centerText tableHeaderFont'>

                        <b>Стоимость для каждого:</b>
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
                    <br />

                    <p className='centerText tableHeaderFont'>
                        <b>Сколько заплатили за продукты:</b>
                        <p className='centerText tableFontProportions'> 
                        (почему скидывать нужно именно столько)
                        </p>
                    </p>

                    <p>
                        {this.props.namesArray.map((name) => {
                            return (
                                <div>
                                    <p className='centerText tableHeaderFont smallPaddingBottom'>
                                        {name}: {this.props.boughtSum[name]} ₽
                                        <p className='centerText tableFontProportions'>
                                            {this.props.boughtSum[name] - this.props.expenses[name] > 0 ?
                                                "в минусе на "
                                                :
                                                "в плюсе на "
                                            }
                                            {Math.abs(this.props.boughtSum[name] - this.props.expenses[name])}
                                            &nbsp;₽
                                        </p>
                                    </p>

                                </div>

                            )
                        })
                        }

                    </p>
                </Accordion.Content>
            </Accordion>
        )
    }
}
