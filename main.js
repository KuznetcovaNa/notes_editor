function initial_editor(){
    var notes_number = 0, tags_number = 0;

    function edit_note_html(note_id, text){
        var edited_note = document.getElementsByClassName(note_id)[0].firstChild;
        edited_note.innerHTML = text;
    }

    function add_note_html(note_id, text){
        var note_div = document.createElement("div");
        note_div.className = note_id + " note_item";
        var text_div = document.createElement("div");
        text_div.className = "note_item_text";
        var note_text = document.createTextNode(text);
        text_div.appendChild(note_text);
        note_div.appendChild(text_div);
        var edit_btn = document.createElement("input");
        edit_btn.className = "btn btn_edit_note";
        edit_btn.setAttribute("type", "button");
        edit_btn.setAttribute("value", "Изменить");
        edit_btn.setAttribute("onclick", "editor.update_note('" + note_id + "', document.getElementsByClassName('" + note_id + "')[0].firstChild.innerHTML)");
        note_div.appendChild(edit_btn);
        var delete_btn = document.createElement("input");
        delete_btn.className = "btn btn_delete_note";
        delete_btn.setAttribute("value", "Удалить");
        delete_btn.setAttribute("type", "button");
        delete_btn.setAttribute("onclick", "editor.delete_note('" + note_id + "')");
        note_div.appendChild(delete_btn);
        document.getElementsByClassName("notes_storage")[0].insertBefore(note_div, document.getElementsByClassName("notes_storage")[0].firstChild);
    }

    function add_tag_html(tag_id, text, autofocus){
        var tag_div = document.createElement("div");
        tag_div.className = tag_id + " tag_item";
        var text_div = document.createElement("textarea");
        text_div.innerHTML = text;
        text_div.className = "tag_item_text";
        text_div.setAttribute("onfocusout", "editor.update_tag('" + tag_id + "', document.getElementsByClassName('" + tag_id + "')[0].firstChild.value)");
        tag_div.appendChild(text_div);
        var delete_btn = document.createElement("input");
        delete_btn.className = "btn btn_delete_tag";
        delete_btn.setAttribute("value", "-");
        delete_btn.setAttribute("type", "button");
        delete_btn.setAttribute("onclick", "editor.delete_tag('" + tag_id + "')");
        tag_div.appendChild(delete_btn);
        document.getElementsByClassName("tags_storage")[0].insertBefore(tag_div, document.getElementsByClassName("tags_storage")[0].firstChild);
        var tag_textarea = document.getElementsByClassName(tag_id)[0].firstChild;
        if (autofocus){
            tag_textarea.focus();
        }
    }

    function get_notes_number(){
        var notes_iterator = 0;
        for (var i=0; i < localStorage.length; i++){
            if (/^editor_note_[0-9]+$/.test(localStorage.key(i))){
                var note_id = localStorage.key(i).split(/editor_note_/)[1];
                if (parseInt(note_id) > notes_iterator) {
                    notes_iterator = parseInt(note_id);
                }
                add_note_html(localStorage.key(i), localStorage.getItem(localStorage.key(i)));
            }
        }
        return notes_iterator;
    }

    function get_tags_number(){
        var tags_iterator = 0;
        for (var i=0; i < localStorage.length; i++){
            if (/^editor_tag_[0-9]+$/.test(localStorage.key(i))){
                var tag_id = localStorage.key(i).split(/editor_tag_/)[1];
                if (parseInt(tag_id) > tags_iterator) {
                    tags_iterator = parseInt(tag_id);
                }
                add_tag_html(localStorage.key(i), localStorage.getItem(localStorage.key(i)), false);
            }
        }
        return tags_iterator;
    }

    function color_tags() {

    }

    function open_edit_window(note_text){
        var edit_layout = document.getElementsByClassName("edit_note_layout")[0];
        edit_layout.style.display = "block";
        var edit_area = document.getElementsByClassName("edit_note_area")[0];
        if (note_text){
            edit_area.value = note_text;
        } else {
            edit_area.value = "";
        }
        color_tags();
    }
    
    function close_edit_window(){
        var edit_layout = document.getElementsByClassName("edit_note_layout")[0];
        edit_layout.style.display = "none";
    }

    return {
        init: function (){
            notes_number = get_notes_number();
            tags_number = get_tags_number();
            if (notes_number === 0) {
                notes_number ++;
                localStorage.setItem("editor_note_" + notes_number, "Первая заметка :) #first_tag");
                add_note_html("editor_note_" + notes_number, "Первая заметка :) #first_tag");
            }
            if (tags_number === 0) {
                tags_number ++;
                localStorage.setItem("editor_tag_" + tags_number, "#first_tag");
                add_tag_html("editor_tag_" + tags_number, "#first_tag", false);
            }
        },

        create_note: function (){
            open_edit_window();
            var save_btn = document.getElementsByClassName("btn_save_note")[0];
            save_btn.onclick = function(){
                editor.save_note(document.getElementsByClassName("edit_note_area")[0].value);
                close_edit_window();
            }
        },

        update_note: function (note_id, note_text){
            open_edit_window(note_text);
            var save_btn = document.getElementsByClassName("btn_save_note")[0];
            save_btn.onclick = function(){
                editor.save_note(document.getElementsByClassName("edit_note_area")[0].value, note_id);
                close_edit_window();
            }
        },

        delete_note: function (note){
            localStorage.removeItem(note);
            var deleted_note = document.getElementsByClassName(note)[0];
            deleted_note.remove();
        },

        create_tag: function (){
            tags_number ++;
            localStorage.setItem("editor_tag_" + tags_number, "#");
            add_tag_html("editor_tag_" + tags_number, "#", true);
        },

        update_tag: function (tag, tag_text){
            localStorage.setItem(tag, tag_text);
        },

        delete_tag: function (tag){
            localStorage.removeItem(tag);
            var deleted_tag = document.getElementsByClassName(tag)[0];
            deleted_tag.remove();
        },

        pass_tag_filter: function (){

        },

        add_tag_filter: function (){

        },

        pass_saving: function (){
            close_edit_window();
        },

        save_note: function (note_text, note){
            if (note){
                localStorage.setItem(note, note_text);
                edit_note_html(note, note_text);
            } else {
                notes_number ++;
                localStorage.setItem("editor_note_" + notes_number, note_text);
                add_note_html("editor_note_" + notes_number, note_text);
            }
        }
    }
}

var editor = initial_editor();
editor.init();
