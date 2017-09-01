import InstrumentFormContainer from '../../../jsx/InstrumentFormContainer';

class DirectEntryReact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      error: null
    };

    this.onSave = this.onSave.bind(this);
  }

  onSave(data) {
    const saveURL = window.location.href;
    $.post(saveURL, {instrumentData: JSON.stringify(data)}, ( responseData, textStatus, jqXHR ) => {
      this.setState({complete: true});
    }).fail((jqXHR, textStatus, errorThrown) => {
      this.setState({error: errorThrown});
    });
  }

  render() {
    const { instrument, initialData, lang, context, options } = this.props;
    const { complete, error } = this.state;

    if (error) {
      return (<div>{error}</div>);
    }

    if (complete) {
      return (<div>Survey successfully submitted.</div>);
    }

    return (
      <div>
        <img id="banner" className="banner"/>
        <img id="logo" src={logo}/>
        <div><font color="white">Date: {curDateSt}</font></div>
        <InstrumentFormContainer
          instrument={instrument}
          initialData={initialData}
          lang={lang}
          context={context}
          options={options}
          onSave={onSave}
        />
      </div>
    );
  }
}


window.onload = function() {
  const instrumentEl = document.querySelector('#instrument');
  const instrument = JSON.parse(instrumentEl.dataset.instrument);
  const context = JSON.parse(instrumentEl.dataset.context);
  const initialData = JSON.parse(instrumentEl.dataset.initial);
  const lang = instrumentEl.dataset.lang;
  const logo = instrumentEl.dataset.logo ? instrumentEl.dataset.logo : "";
  const options = { surveyMode: true };
  const curDate = new Date();
  const curDateSt = (curDate.getMonth()+1) + "/" + curDate.getDate() + "/" + curDate.getFullYear();
  ReactDOM.render(
    <DirectEntryReact
      instrument={instrument}
      initialData={initialData}
      lang={lang}
      context={context}
      options={options}
    />,
    document.getElementById("container")
  );
};
