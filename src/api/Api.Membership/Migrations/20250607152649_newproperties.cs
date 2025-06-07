using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Membership.Migrations
{
    /// <inheritdoc />
    public partial class newproperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Kids_Users_UserId",
                table: "Kids");

            migrationBuilder.AddColumn<string>(
                name: "EmailAddress",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MemberType",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Kids_Users_UserId",
                table: "Kids",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Kids_Users_UserId",
                table: "Kids");

            migrationBuilder.DropColumn(
                name: "EmailAddress",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "MemberType",
                table: "Users");

            migrationBuilder.AddForeignKey(
                name: "FK_Kids_Users_UserId",
                table: "Kids",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
