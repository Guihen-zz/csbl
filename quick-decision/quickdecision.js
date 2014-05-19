var askTree = new Object();
var key;

function readDecisionFile()
{
  $.get('decision.txt', function(data) {

    var lines = data.split( "\n");
    var way;
    for( var i = 0; i < lines.length; i++)
    {
      if( lines[i].match( /\s*}\s*/))
      {
        way = 'left';
        while ( i < lines.length && lines[i].match( /\s*}\s*/))
        {
          askTree = askTree.parent;
          i++;
        }
        if( i == lines.length) break;
        if( lines[i].match(/\s*{\s*/)) i++;
      }
      else if( lines[i].match(/\s*{\s*/))
      {
        way = 'right';
        i++;
      }

      var result = lines[i].match(/\s*(.*\?)\s*/);
      if( result != null)
      {
        if( i == 0)
        {
          askTree.ask = result[1];
        }
        else
        {
          askChild =  new Object();
          askChild.ask = result[1];
          askChild.parent = askTree;
          askTree[way] = askChild;
          askTree = askChild;
        }
      }
    }
  }, 'text').done(function() { startAsk(); });
}

function startAsk()
{
  if( askTree == null)
    $("#ask").html("Fim da árvore de perguntas.");
  else
    $("#ask").html(askTree.ask);
}

function keyPressed( event)
{
  getAnswer( event.keyCode);
}

function getAnswer( key)
{
  // < := 37
  // > := 39
  // space := 32
  if( key == 37)
  {
    askTree = askTree.left;
    startAsk();
  }
  else if (key == 39)
  {
    askTree = askTree.right;
    startAsk(); 
  }
}