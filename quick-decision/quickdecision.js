var annotationSet;
var annotationHash;

function readDecisionFile()
{
  $.get('decision.txt', function(data) {

    prepareAnnotators( data.split( "\n"));
  }, 'text').done(function() { prepareButtons(); });
}

function newAnnotation( name)
{
  annotationHash.push( name);
  return annotationHash.length - 1;
}

function prepareAnnotators( text)
{
  annotationSet = new Array();
  annotationHash = new Array();
  generateAnnotators( annotationSet, text, 0);
}

function generateAnnotators( aSet, text, lineIndex)
{
  for( var j = lineIndex; j < text.length; j++)
  {
    if( text[j].match( /\s*{\s*/)) /* New subcategory */
    {
      var obj = aSet.pop();
      j = generateAnnotators( obj.children, text, j + 1);
      aSet.push( obj);
    }
    else if( text[j].match( /\s*}\s*/))
    {
      j++;
      break;
    }
    else if( text[j].match( /\s*\S+\s*/))
    {
      var item = new Object();
      item.text = text[j];
      item.hash = newAnnotation( item.text);
      item.children = new Array();
      aSet.push( item);
    }
  }
  return j;
}

function prepareButtons()
{
  generateButtons( annotationSet, "#annotators");
}

function generateButtons( aSet, div)
{
  for( var i = 0; i < aSet.length; i++)
  {
    var obj = aSet[i];
    var button = '<a class="button" id="' + obj.hash + 
                  '" onclick="mark(' + obj.hash + ')">' + obj.text + '</a>';

    $( "#hidden").append('<input type="hidden" id="hidden-' + obj.hash + '" />');
    if( obj.children.length > 0) /* have child */
    {
      $( div).append( '<div id="children-' + obj.hash + '" class="child"></div>');
      generateButtons( obj.children, "#children-" + obj.hash);
    }

    $( div).append( button);
  }
}

function mark( id)
{
  if( $("#children-" + id).length)
  {
    hideChildren();
    $("#children-" + id).show();
  }

  markMe( id);
}

function hideChildren()
{
  $(".child").each(function(){
    $(this).hide();
  });
}

function markMe( id)
{
  var hidden = $("#hidden-" + id);
  if( hidden.val() == 1)
  {
    $("#" + id).css({"background-color": "#ECECEC"});
    hidden.val(0);
  }
  else
  {
    $("#" + id).css({"background-color": "#66CDAA"});
    hidden.val(1);
  }
}